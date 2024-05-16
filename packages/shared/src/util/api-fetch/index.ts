import { Headers } from 'node-fetch'

import { api } from '../../config/index'
import { _ } from '../browser/index'
export * from './fetcher'

export const baseUrl = api.baseUrl
export const headers = _.mapValues(api.headers, (headers) => new Headers(headers))
