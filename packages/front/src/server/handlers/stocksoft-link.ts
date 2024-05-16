import { Socket } from 'socket.io'

import { myFetch, baseUrl } from '@awamstock/shared/util'
import { SOCKET_EVENTS } from '@awamstock/shared/config'

baseUrl.stocksoftLink = 'http://172.17.128.1:8081'

export interface IStocksoftSocketData {
  name: 'setLinkSoftUrl' | 'showToolWindow' | 'list' | 'setOne' | 'setAll'
  data: any
  id: string
}

export interface IStocksoftWindow {
  hwnd?: string
  name?: string
  code?: string
}

async function requestGbkText(url: string) {
  try {
    return myFetch(url, { encoding: 'gbk' })
  } catch (error) {
    console.log(error)
    return null
  }
}

async function setLinkSoftUrl(ip: string) {
  return (baseUrl.stocksoftLink = `http://${ip}:8081`)
}

async function showToolWindow() {
  return await requestGbkText(`${baseUrl.stocksoftLink}/ListWin`)
}

async function list() {
  return await requestGbkText(`${baseUrl.stocksoftLink}/GetSofts`)
}

async function setOne(params: IStocksoftWindow) {
  return await requestGbkText(`${baseUrl.stocksoftLink}/?hwnd=${params.hwnd}&&code=${params.code}&&tp=1`)
}

async function setAll(params: IStocksoftWindow) {
  return await requestGbkText(`${baseUrl.stocksoftLink}/LinkAll?code=${params.code}&&tp=1`)
}

export type IStocksoftEventHandler = ((param: string) => Promise<string | null>) | ((params: IStocksoftWindow) => Promise<string | null>)

const eventHandlers: Record<IStocksoftSocketData['name'], IStocksoftEventHandler> = {
  setLinkSoftUrl,
  showToolWindow,
  list,
  setOne,
  setAll,
}

export function handleStocksoftLinkEvent(client: Socket) {
  client.on(SOCKET_EVENTS.clientEvent, async (event: IStocksoftSocketData) => {
    if (!eventHandlers[event.name]) return

    const res = await eventHandlers[event.name](event.data)

    client.emit(SOCKET_EVENTS.serverEvent, {
      ...event,
      data: res,
    })
  })
}

export default {
  handleStocksoftLinkEvent,
  setLinkSoftUrl,
  showToolWindow,
  list,
  setOne,
  setAll,
}
