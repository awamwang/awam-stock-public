import { Injectable, Global } from '@nestjs/common'

import { PlainData, ISuccessResponse, IStrNameMap } from '@awamstock/shared/type'

export interface IResponseHelperOptions<T extends PlainData> {
  // ctx: Context
  res: Partial<T> | T[] | null
  msg?: string
  strNameMap?: IStrNameMap<T>
}
@Injectable()
export class ResponseHelper {
  success<T extends PlainData>(options: IResponseHelperOptions<T>, status = 200) {
    const { res = {}, msg = '请求成功', strNameMap } = options
    const resp: ISuccessResponse<T> = {
      code: 0,
      data: res,
      msg,
    }

    if (strNameMap) {
      resp.strNameMap = strNameMap
    }

    // ctx.body = resp
    // ctx.status = status

    return resp
  }
}
