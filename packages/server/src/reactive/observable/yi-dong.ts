import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { _ } from '@awamstock/shared/browser'
import { IYiDong } from '@awamstock/model'
import { BasicRecordObservable } from './basic-record'

@Injectable()
export class YiDongObservableService extends BasicRecordObservable<IYiDong> {
  protected records: IYiDong[] = []

  constructor(@InjectModel('YiDong') protected model) {
    super(model, {
      name: '大盘异动',
      data: [],
    })
  }

  getNewRecords(incomeRecords: IYiDong[]): IYiDong[] {
    return _.differenceBy(incomeRecords, this.records, 'id').sort((a, b) => b.time - a.time)
  }
}
