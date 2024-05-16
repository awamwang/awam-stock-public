import { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

import { IMarketMessage, IStockPool, StockPoolType, IMoodBlockItem } from '@awamstock/model'
import { stockPoolTypeMap } from '@awamstock/model/types'
import { getNormalizeTimePartFromMillisecond, toFixed } from '@awamstock/shared/browser'
import { UNKNOWN } from '@awamstock/shared/global'
import { colorRed } from '@/styles/ts/index'

/**
 * column
 */
export const formatPercentage = function (_: unknown, __: unknown, cellValue: number) {
  if (!cellValue) return ''

  return `${toFixed(cellValue)}%`
}
export const formatRowTime = function (_: unknown, __: unknown, cellValue: number) {
  if (!cellValue) return ''

  return getNormalizeTimePartFromMillisecond(cellValue)
}
export const formatStockPoolRowTime = function (row: IStockPool, column: TableColumnCtx<IStockPool>, cellValue: number) {
  if (column.property === 'first_limit_up') {
    return row.type === 'dt'
      ? getNormalizeTimePartFromMillisecond(row.first_limit_down)
      : row.type === 'zt_zr'
      ? getNormalizeTimePartFromMillisecond(row.yesterday_first_limit_up)
      : getNormalizeTimePartFromMillisecond(cellValue)
  }
  if (column.property === 'last_limit_up') {
    return row.type === 'dt'
      ? getNormalizeTimePartFromMillisecond(row.last_limit_down)
      : row.type === 'zt_zr'
      ? getNormalizeTimePartFromMillisecond(row.yesterday_last_limit_up)
      : getNormalizeTimePartFromMillisecond(cellValue)
  }

  return getNormalizeTimePartFromMillisecond(cellValue)
}
export const formatRowStockPoolTypeMap = function (row: unknown, column: unknown, cellValue: StockPoolType) {
  return stockPoolTypeMap[cellValue] || UNKNOWN
}
export const stockPoolBlocks = function (row: IStockPool) {
  return row.surge_reason && row.surge_reason.related_plates && row.surge_reason.related_plates.map((b: { plate_name: string }) => b.plate_name).join(' ; ')
}
export const stockPoolReason = function (row: IStockPool) {
  return row.surge_reason && row.surge_reason.stock_reason
}
export const marketMessageBlocks = function (row: IMarketMessage) {
  return row.blocks && row.blocks.map((b: { Name: string }) => b.Name).join(' ; ')
}

/**
 * cell
 */
export interface TableCellOptions<T> {
  row: T
  column: TableColumnCtx<T>
  rowIndex: number
  columnIndex: number
}

type SuperRow = IStockPool & IMarketMessage & IMoodBlockItem
export function cellStyle<T extends SuperRow>(options: TableCellOptions<T>) {
  const { row, column } = options

  switch (column.property) {
    case 'power':
      return row.power > 5000 ? colorRed : {}
    default:
      return {}
  }
}
