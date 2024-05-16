import { TUSHARE_TOKEN } from '@awamstock/shared'
import { myFetch, baseUrl } from '../../../lib/api-fetch/index'

export function check() {
  if (!TUSHARE_TOKEN.length) {
    throw new Error('tushare token is empty')
  }
}

export function fetchTushare(body: any) {
  check()

  return myFetch(`${baseUrl.tusahre}`, {
    method: 'POST',
    body: JSON.stringify({
      token: TUSHARE_TOKEN,
      ...body,
    }),
    headers: { 'Content-Type': 'application/json' },
  })
}
