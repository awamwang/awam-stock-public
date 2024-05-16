import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { _ } from '@awamstock/shared/browser'
import { IMoodBlockStock } from '@awamstock/model'
import { BasicRecordObservable } from './basic-record'

@Injectable()
export class MoodBlockStockObservableService extends BasicRecordObservable<IMoodBlockStock> {
  protected records: IMoodBlockStock[] = []

  constructor(@InjectModel('MoodBlockStock') protected model) {
    super(model, {
      name: '板块人气个股',
      data: [],
    })
  }

  getNewRecords(incomeRecords: IMoodBlockStock[]): IMoodBlockStock[] {
    return _.differenceWith(incomeRecords, this.records, (arrVal, othVal) => arrVal.block_code === othVal.block_code && arrVal.code === othVal.code && arrVal.date === othVal.date)
  }
}
