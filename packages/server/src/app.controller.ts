import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /** 根路径健康检查（排除 api 前缀，供 Nginx / 探活使用） */
  @Get()
  health() {
    return this.appService.getHealth()
  }

  /** 显式健康检查路径 */
  @Get('health')
  healthCheck() {
    return this.appService.getHealth()
  }
}
