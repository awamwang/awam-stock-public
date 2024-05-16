import { BehaviorSubject } from 'rxjs'

import { Injectable } from '@nestjs/common'
// import { InjectModel } from '@nestjs/mongoose'
import { _ } from '@awamstock/shared/browser'
import { ISocketDataList } from '@awamstock/shared/type'
import { PlainDataModel } from '@awamstock/model'
import { Model } from '@awamstock/model/mongoose'

@Injectable()
export class BasicRecordObservable<T extends PlainDataModel> {
  protected records: T[] = []
  // protected data: ISocketDataList<T> = {
  //   name: '市场消息',
  //   data: [],
  // }
  public record: BehaviorSubject<ISocketDataList<T>>

  constructor(protected model: Model<T>, protected data: ISocketDataList<T>) {
    this.record = new BehaviorSubject(data)
  }

  async init(query: { date: string }) {
    this.record.next({
      ...this.data,
      data: await this.model.find(query),
    })
  }

  getNewRecords(incomeRecords: T[]): T[] {
    throw new Error('Method not implemented.')
  }

  async update(incomeRecords: T[]) {
    // 从接收到的数据中，过滤掉已经存在的数据
    const newRecords = this.getNewRecords(incomeRecords)
    this.records = [...newRecords, ...this.records]

    this.record.next({
      ...this.record.getValue(),
      data: newRecords,
    })
  }
}
