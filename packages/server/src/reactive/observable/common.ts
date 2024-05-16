import { Subject } from 'rxjs'

import { Injectable } from '@nestjs/common'
import { ITypeSocketData } from '@awamstock/model'

@Injectable()
export class CommonObservableService {
  ob: Subject<ITypeSocketData> = new Subject<ITypeSocketData>()
}
