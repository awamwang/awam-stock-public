import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { IRiskyLonghu } from '@awamstock/model'

@Injectable()
export class RiskyLonghuService {
  constructor(@InjectModel('RiskyLonghu') private model) {}

  async getOne(): Promise<IRiskyLonghu> {
    return await this.model.findOne().sort({ date: -1 })
  }
}
