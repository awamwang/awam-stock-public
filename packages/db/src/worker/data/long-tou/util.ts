import { LONG_TOU_USERID, LONG_TOU_TOKEN } from '@awamstock/shared/config'
import { myFetch, baseUrl } from '../../../lib/api-fetch/index'

export const API_V = 'w25'
export const API_V_HQ = 'w40'
export const USER_ID = LONG_TOU_USERID
export const TOKEN = LONG_TOU_TOKEN

/** 历史宿主（成分股列表等） */
export const LongTouHisUrl = (baseUrl as Record<string, string>).LongTouHis || 'https://apphis.longhuvip.com/w1/api/index.php'
/** 新行情宿主（竞价榜等） */
export const LongTouHqUrl = (baseUrl as Record<string, string>).LongTouHq || 'https://apphwhq.longhuvip.com/w1/api/index.php'

const LongTouUa = 'lhb/5.13.7 (com.kaipanla.www; build:0; iOS 16.1.0) Alamofire/4.9.1'

/** 开盘啦 POST form */
export async function longTouPost(url: string, fields: Record<string, string | number | undefined | null>) {
  const body = new URLSearchParams()
  for (const [k, v] of Object.entries(fields)) {
    if (v == null) continue
    body.set(k, String(v))
  }

  return myFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      Accept: '*/*',
      'User-Agent': LongTouUa,
    },
    body: body.toString(),
  })
}

/** 板块成分股列表（须走 apphis） */
export function zhiShuStockListUrl(params: { code: string; limit?: number }) {
  const { code, limit = 300 } = params
  return (
    `${LongTouHisUrl}?Order=1&st=${limit}&a=ZhiShuStockList_W8&c=ZhiShuRanking` +
    `&PhoneOSNew=1&old=1&Token=${TOKEN}&Index=0&apiv=w25&Type=6&UserID=${USER_ID}&PlateID=${code}&`
  )
}

export async function getBlock(params: { code: string }) {
  const res = await myFetch(zhiShuStockListUrl({ code: params.code, limit: 30 }))

  return {
    code: params.code,
    name: '',
    stockCount: (res.Stocks as string[]).length,
    codeList: res.Stocks as string[],
    from: 'long-tou',
    type: 'gn',
    updatedAt: new Date(),
  }
}
