// import { AxiosRequestConfig } from 'axios'

import { PlainDataModel, IRequestQuery, ISuccessResponseList, ISuccessResponseSingleWithMap } from '@awamstock/shared/type'
export type { IRequestQuery }
import env from '@/utils/env'

export const API_PREFIX = env.apiPrefix
const api = axios.create({
  // baseURL: `https://${env.serverHost}:${env.serverPort}${API_PREFIX}`,
  baseURL: `http://localhost:${env.FRONT_HTTP_PORT}${API_PREFIX}`,
  withCredentials: true,
  xsrfCookieName: 'csrfToken',
  // xsrfCookieName: '_csrf',
  xsrfHeaderName: 'x-csrf-token',
  timeout: 10000,
  // headers: {'X-Custom-Header': 'foobar'}
})

api.interceptors.response.use(
  (data) => {
    if ([200, 201].includes(data.status)) {
      return data
    }

    switch (data.status) {
      case 401:
        throw new Error('Unauthorized')
      default:
        console.error(data)
    }
  },
  (err) => {
    if (err.response) {
      switch (err.response.status) {
        case 401:
          throw new Error('Unauthorized')
        case 302:
          throw new Error('Redirect')
        default:
          console.error(err.response)
      }
    }

    return Promise.reject(err)
  }
)

// api.interceptors.request.use((config) => {
//   csrfHandler(config)

//   return config
// })

export async function get<T extends PlainDataModel = PlainDataModel>(path: string, id: string | number): Promise<ISuccessResponseSingleWithMap<T>> {
  const resp = await api.get(`${path}/${id}`)

  return resp.data
}

export async function list<T extends PlainDataModel = PlainDataModel>(path: string, params: IRequestQuery<T> = {}): Promise<ISuccessResponseList<T>> {
  const resp = await api.get(path, { params })

  return resp.data
}

export async function getOne<T extends PlainDataModel = PlainDataModel>(path: string, params: IRequestQuery<T> = {}): Promise<ISuccessResponseList<T>> {
  const resp = await api.get(path, { params: { ...params, _limit: 1 } })

  return resp.data
}

export async function set<T extends PlainDataModel = PlainDataModel>(path: string, id: string | number, data: T): Promise<ISuccessResponseSingleWithMap<T>> {
  const resp = await api.post(`${path}/${id}`, data)

  return resp.data
}

export async function add<T extends PlainDataModel = PlainDataModel>(path: string, data: T): Promise<ISuccessResponseSingleWithMap<T>> {
  const resp = await api.post(`${path}`, data)

  return resp.data
}

export default api
