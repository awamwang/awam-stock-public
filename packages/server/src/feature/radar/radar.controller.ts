import { Controller } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { BasicController } from '../../lib/contoller'
import { IRadar, radarStrNameMap } from '@awamstock/model'

@Controller('radars')
export class RadarController extends BasicController<IRadar> {
  constructor(@InjectModel('Radar') private myModel) {
    super(myModel, {
      strNameMap: radarStrNameMap,
      supportedListQuery: ['date', 'code', 'name', 'type', 'plate_type', 'lb'],
      supportedGetParam: ['_id', 'date', 'code', 'name', 'type', 'plate_type', 'lb'],
      _sort: '-time',
    })
  }
}
