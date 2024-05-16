import fetch, { Response, RequestInit } from 'node-fetch'

class HTTPResponseError extends Error {
  response: Response

  constructor(response: any, ...args: []) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`, ...args)
    this.response = response
  }
}

const checkStatus = (response: Response) => {
  if (response.ok) {
    if (response.status && response.status >= 200 && response.status < 300) {
      return response
    }
  }

  throw new HTTPResponseError(response)
}

const handleError = async (error: any) => {
  console.error(error)

  const errorBody = await error.response.text()
  console.error(`Error body: ${errorBody}`)
}

export async function myFetch(url: string, options?: RequestInit): Promise<any> {
  const response = await fetch(url, options)

  try {
    checkStatus(response)
  } catch (error: any) {
    await handleError(error)
  }

  return response.json()
  // const data = await response.json()
  // console.log(data)
}
