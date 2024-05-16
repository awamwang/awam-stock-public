import { LONG_TOU_USERID, LONG_TOU_TOKEN } from '@awamstock/shared/config'
import { myFetch, baseUrl } from '../../../lib/api-fetch/index'

export const API_V = 'w25'
export const USER_ID = LONG_TOU_USERID
export const TOKEN = LONG_TOU_TOKEN

export async function getBlock(params: { code: string }) {
  const res = await myFetch(
    `${baseUrl.LongTou}?Order=1&st=30&a=ZhiShuStockList_W8&c=ZhiShuRanking&PhoneOSNew=1&old=1&Token=${TOKEN}&Index=0&apiv=w25&Type=6&UserID=${USER_ID}&PlateID=${params.code}&`
  )

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
