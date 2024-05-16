import { NONE } from '@awamstock/shared/global'

export const COLLECTIONS = {
  globalConfig: 'global',
  stock: 'stock',
  block: 'block',
  blockDay: 'blockDay',
  environment: 'environment',
  environment_full: 'environment_full',
  moodList: 'moodList',
  moodStock: 'moodStock', // 个股人气
  moodStock_full: 'moodStock_full', // 个股人气
  moodStockItem: 'moodStockItem',
  moodBlock: 'moodBlock', // 板块人气
  moodBlock_full: 'moodBlock_full', // 板块人气
  moodBlockItem: 'moodBlockItem',
  moodBlockStock: 'moodBlockStock', // 板块人气个股
  radar_old: 'radar_old', // 即时行情
  radar_old_full: 'radar_old_full', // 即时行情
  radar: 'radar', // 短线精灵
  radar_full: 'radar_full', // 短线精灵
  marketMessage: 'marketMessage',
  marketMessage_full: 'marketMessage_full',
  yiDong: 'yiDong',
  yiDong_full: 'yiDong_full',
  ztView: 'ztView', // 涨停表现
  ztView_full: 'ztView_full', // 涨停表现
  globalMarket: 'globalMarket', // 全球市场行情
  globalMarket_full: 'globalMarket_full', // 全球市场行情
  beforeOpenStock: 'beforeOpenStock', // 集合竞价异动
  focusedDepartment: 'focusedDepartment',
  thsDepartmentTrade: 'thsDepartmentTrade',
  departmentTrade: 'departmentTrade',
  riskyLonghu: 'riskyLonghu',
  tradeCalendar: 'tradeCalendar',
  safeScore: 'safeScore',
  stockPool: 'stockPool',
  [NONE]: NONE, // 特殊名称，用于表示不存在的集合
}

export type ICollectionConfig = typeof COLLECTIONS
export type CollectionConfigKey = keyof ICollectionConfig

export default COLLECTIONS
