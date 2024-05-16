import fetch, { Response, RequestInit } from 'node-fetch'
import { IconvEncoding, decode, encode } from '../encoder'

class HTTPResponseError extends Error {
  response: Response

  constructor(response: any, ...args: []) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`, ...args)
    this.response = response
  }
}

async function checkStatus(response: Response) {
  if (response.ok) {
    return response
  }
  if (response.status === 301 || response.status === 302) {
    const location = response.headers.get('location')
    if (location) {
      const locationURL = new URL(location, response.url)
      await fetch(locationURL, { redirect: 'manual' })
    }
  } else {
    throw new HTTPResponseError(response)
  }
}

const handleError = async (error: any) => {
  if (error.response) {
    const errorBody = await error.response.text()
    console.log(`Fetch Error: ${errorBody}`)
  } else {
    console.log(`Fetch Error: ${error}`)
  }
}

export async function handleEncoding(resp: Response, encoding: IconvEncoding = 'utf-8') {
  const buf = await resp.buffer()

  return decode(buf, encoding)
}

export async function myFetch(url: string, options?: RequestInit & { encoding?: IconvEncoding }): Promise<any> {
  try {
    const response = await fetch(url, options)
    checkStatus(response)

    if (options?.encoding) {
      return handleEncoding(response, options.encoding)
    }

    const contentType = response.headers.get('content-type')
    if (contentType?.includes('text/plain') || contentType?.includes('text/html')) {
      // return response.text()
      return response
    } else {
      return response.json()
    }
  } catch (error: any) {
    await handleError(error)
  }
}
