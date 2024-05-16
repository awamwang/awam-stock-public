import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { EnvironmentSchema } from '@awamstock/model'
import { EnvironmentService } from './environment.service'
import { EnvironmentController } from './environment.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Environment', schema: EnvironmentSchema }])],
  providers: [EnvironmentService],
  controllers: [EnvironmentController],
})
export class EnvironmentModule {}
