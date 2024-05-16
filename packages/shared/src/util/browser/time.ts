import dayjs, { Dayjs, ConfigType } from 'dayjs'
export { dayjs }

export const DATE_FORMAT = 'YYYYMMDD'
export const TIME_FORMAT = 'HH:mm:ss'
export const DATE_TIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`

export class Timer {
  DATE_FORMAT = DATE_FORMAT
  TIME_FORMAT = TIME_FORMAT
  DATE_TIME_FORMAT = DATE_TIME_FORMAT
  private _time = dayjs().format(`${DATE_FORMAT} ${TIME_FORMAT}`)
  private _today = dayjs().format(DATE_FORMAT) // 全局共享,节省计算时间
  private _yesterday = dayjs().subtract(1, 'day').format(DATE_FORMAT)

  // constructor() {}

  nowStr(): string {
    return dayjs().format(`${DATE_FORMAT} ${TIME_FORMAT}`)
  }

  time(): string {
    return this._time
  }

  setTime(time: string) {
    this._time = time
  }

  updateTime() {
    this._time = dayjs().format(`${DATE_FORMAT} ${TIME_FORMAT}`)
  }

  today(): string {
    return this._today
  }

  todayOpenTime(): Dayjs {
    return dayjs(`${this._today} 09:30:00`)
  }

  todayCloseTime(): Dayjs {
    return dayjs(`${this._today} 15:00:00`)
  }

  setToday(today: string) {
    this._today = dayjs(today).format(DATE_FORMAT)
    this.setYesterday(dayjs(today).subtract(1, 'day').format(DATE_FORMAT))
  }

  updateToday() {
    this.updateYesterday()
    return (this._today = dayjs().format(DATE_FORMAT))
  }

  yesterday(): string {
    return this._yesterday
  }

  setYesterday(yesterday: string) {
    this._yesterday = dayjs(yesterday).format(DATE_FORMAT)
  }

  updateYesterday() {
    return (this._yesterday = dayjs().subtract(1, 'day').format(DATE_FORMAT))
  }
}
export const timer: Timer = new Timer()

/**
 *
 * @param time
 * @returns
 */
export function timeToCronTime(time: string): string {
  const [hour, minute, second] = time.split(':')

  return `${second} ${minute} ${hour} * * *`
}
// console.log(timeToCronTime('18:01:00'))
// console.log(timeToCronTime('9-15:*:*/30'))
// console.log(timeToCronTime('9:15-30:*/30'))

export function normalizeDate(date: ConfigType, format?: string): string {
  if (!date) return ''

  return dayjs(date, format).format(DATE_FORMAT)
}

export function normalizeTime(time: ConfigType, format?: string): string {
  if (!time) return ''

  return dayjs(time, format).format(`${DATE_FORMAT} ${TIME_FORMAT}`)
}

export function getNormalizeTimePartFromMillisecond(time: number): string {
  return normalizeTime(dayjs.unix(time)).split(' ')[1]
}
// console.log(getNormalizeTimePartFromMillisecond(1579098980))

export function isNDayAgo(date: string | Dayjs, n = 0) {
  const ago = dayjs().subtract(n, 'day')
  const dateObj = typeof date === 'string' ? dayjs(date) : date

  return dateObj.isBefore(ago, 'day')
}

export function isBefore(time1: ConfigType, time2: string | Dayjs, format = DATE_TIME_FORMAT): boolean {
  return dayjs(time1, format).isBefore(dayjs(time2, format))
}

export function afterTodayTime(time: string, format: string = TIME_FORMAT) {
  const fullFormat = `${DATE_FORMAT} ${format}`
  const todayStartTimeStr = dayjs().startOf('day').format(fullFormat)
  const targetTimeStr = todayStartTimeStr.split(' ')[0] + ' ' + time
  const targetTime = dayjs(targetTimeStr, fullFormat)

  return dayjs().isAfter(targetTime)
}
// console.log(afterTodayTime('10:25:01'))

export function yearCalendar(year = dayjs().year(), format = DATE_FORMAT) {
  const list: string[] = []
  let currentDate = dayjs(`${year}0101`)

  while (currentDate.year() === year) {
    list.push(currentDate.format(format))
    currentDate = currentDate.add(1, 'day')
  }
}

export function calendarBetween(start: string, end: string, format = DATE_FORMAT) {
  const list: string[] = []
  let currentDate = dayjs(start, format)

  while (currentDate.isBefore(end)) {
    list.push(currentDate.format(format))
    currentDate = currentDate.add(1, 'day')
  }

  return list
}
