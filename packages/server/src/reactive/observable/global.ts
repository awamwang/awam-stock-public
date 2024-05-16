import { BehaviorSubject } from 'rxjs'
import { filter, debounceTime } from 'rxjs'

import { Injectable } from '@nestjs/common'
import { _ } from '@awamstock/shared/browser'

@Injectable()
export class GlobalObservableService {
  lastTradeDate: any

  constructor() {
    let lastTradeDateRcord = ''
    const lastTradeDate = new BehaviorSubject<string>('')
    const debouncedLastTradeDate = lastTradeDate.pipe(filter((x) => x !== lastTradeDateRcord)).pipe(debounceTime(10000))

    this.lastTradeDate = {
      next: (v: string) => {
        return lastTradeDate.next((lastTradeDateRcord = v))
      },
      subscribe: debouncedLastTradeDate.subscribe.bind(debouncedLastTradeDate),
      getValue: lastTradeDate.getValue.bind(lastTradeDate),
    }
  }
}
