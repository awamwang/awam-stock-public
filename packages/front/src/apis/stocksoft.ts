import { client } from '@/composables/useSetStockCode'
import { IStocksoftWindow, IStocksoftSocketData } from '@/server/handlers/stocksoft-link'
import { SOCKET_EVENTS } from '@awamstock/shared/global'
import { _ } from '@awamstock/shared/browser'

export type { IStocksoftWindow }

const requestRecord: Record<string, any> = {}
let reqId = 1
function emitStocksoftEvent(name: IStocksoftSocketData['name'], params: any): Promise<string> {
  const id = reqId++

  client.emit(SOCKET_EVENTS.clientEvent, {
    name,
    data: params,
    id,
  })

  return new Promise((resolve, reject) => {
    requestRecord[id] = resolve
    // client.on(SOCKET_EVENTS.serverEvent, (event: any) => {
    //   if (event.name === name) {
    //     resolve(event.data)
    //   }
    // })
  })
}

client.on('connect', () => {
  console.log('[background] stocksoft socket connected')

  client.on(SOCKET_EVENTS.serverEvent, (event: any) => {
    if (requestRecord[event.id]) {
      requestRecord[event.id](event.data)
      delete requestRecord[event.id]
    }
  })
})

export async function setLinkSoftUrl(params?: any): Promise<string> {
  return await emitStocksoftEvent('setLinkSoftUrl', params)
}

// ListWin
export async function showToolWindow(params?: any): Promise<string> {
  return (await emitStocksoftEvent('showToolWindow', params)).replace('\x7F', '')
}
// GetSofts
export async function list(params?: any): Promise<IStocksoftWindow[]> {
  const res = await emitStocksoftEvent('list', params)

  try {
    // const json = JSON.parse(res.split('],[').slice(0, -1).join('],[') + ']]')
    const json = JSON.parse(res + '"]]')
    return json.map((item: any) => ({
      hwnd: item[0],
      name: item[1],
      code: item[2],
    }))
  } catch (e) {
    return []
  }
}

// ?hwnd=0x000D280A&&code=000721&&tp=1
export async function setOne(params?: IStocksoftWindow): Promise<string> {
  return await emitStocksoftEvent('setOne', {
    ...params,
    tp: 1,
  })
}

// LinkAll?code=000721&&tp=1
export async function setAll(params: IStocksoftWindow): Promise<string> {
  return await emitStocksoftEvent('setAll', {
    ...params,
    tp: 1,
  })
}
