import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { _ } from '@awamstock/shared/browser'
import { IRadar } from '@awamstock/model'
import { BasicRecordObservable } from './basic-record'

@Injectable()
export class RadarObservableService extends BasicRecordObservable<IRadar> {
  protected records: IRadar[] = []

  constructor(@InjectModel('Radar') protected model) {
    super(model, {
      name: '短线精灵',
      data: [],
    })
  }

  getNewRecords(incomeRecords: IRadar[]): IRadar[] {
    return _.differenceWith(incomeRecords, this.records, (arrVal, othVal) => arrVal.time === othVal.time && arrVal.code === othVal.code && arrVal.type === othVal.type).sort(
      (a, b) => b.time - a.time
    )
  }
}
