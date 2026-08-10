import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  /** 服务存活探活结果 */
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
  }
}
