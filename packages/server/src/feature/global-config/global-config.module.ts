import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { GlobalConfigSchema } from '@awamstock/model'
import { GlobalConfigService } from './global-config.service'
import { GlobalConfigController } from './global-config.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'GlobalConfig', schema: GlobalConfigSchema }])],
  providers: [GlobalConfigService],
  controllers: [GlobalConfigController],
})
export class GlobalConfigModule {}
