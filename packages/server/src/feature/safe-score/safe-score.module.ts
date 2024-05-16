import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SafeScoreSchema } from '@awamstock/model'
import { SafeScoreService } from './safe-score.service'
import { SafeScoreController } from './safe-score.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'SafeScore', schema: SafeScoreSchema }])],
  providers: [SafeScoreService],
  controllers: [SafeScoreController],
})
export class SafeScoreModule {}
