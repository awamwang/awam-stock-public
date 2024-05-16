import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { _ } from '@awamstock/shared/browser'
import { IMarketMessage } from '@awamstock/model'
import { BasicRecordObservable } from './basic-record'

@Injectable()
export class MarketMessageObservableService extends BasicRecordObservable<IMarketMessage> {
  protected records: IMarketMessage[] = []

  constructor(@InjectModel('MarketMessage') protected model) {
    super(model, {
      name: '市场消息',
      data: [],
    })
  }

  getNewRecords(incomeRecords: IMarketMessage[]): IMarketMessage[] {
    return _.differenceBy(incomeRecords, this.records, 'id').sort((a, b) => b.time - a.time)
  }
}
