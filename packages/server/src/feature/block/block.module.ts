import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { BlockSchema } from '@awamstock/model'
import { BlockService } from './block.service'
import { BlockController } from './block.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Block', schema: BlockSchema }])],
  providers: [BlockService],
  controllers: [BlockController],
})
export class BlockModule {}
