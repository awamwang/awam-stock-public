import { IStock, IBlock } from '@awamstock/model'

import { Analyst } from '../analyst'

export class StockPoolAnalyst extends Analyst {
  // async run(stocks: IStock[] | IStock['code'][]) {}

  setBlocks() {
    // const blocks = await this.ctx.service.block.getBlocks()
    // this.ctx.service.block.setBlocks(blocks)
  }
}
