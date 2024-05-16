import { ModelFactory } from '../util'
import { IDocument } from './BaseModel'

const baoer = {
  temperature: 30.32813231401065, // 大盘情绪温度
  broken_c: 29, // 炸板数目
  broken_r: 0.31868131868131866, // 炸板率
  zt_avg_zr: 0.012524742317948714, // 涨停溢价
  time_baoer: 1657848300,
}

const fund = {
  s2n: 0, // 北向净流入
  hk2sz: 0, // 港股通流入
  hk2sh: 0, // 沪股通流入
  net_s2n: 0, // 北向净买
  net_hk2sz: 0, // 港股通净买
  net_hk2sh: 0, // 沪股通净买
  m_net: -3616540847, // 主力净买
  net_small: -3616540847, // 小单净买
  net_middle: -3616540847, // 中单净买
  net_big: -3616540847, // 大单净买
  net_super: -3616540847, // 超大单净买
} // eastmoney

const data = {
  '-1': '1018',
  '-2': '517',
  '-3': '171',
  '-4': '51',
  '-5': '22',
  '-6': '8',
  '-7': '6',
  '-8': '2',
  '-9': '1',
  '-10': '1',
  '0': '182',
  '1': '981',
  '2': '659',
  '3': '429',
  '4': '231',
  '5': '137',
  '6': '64',
  '7': '57',
  '8': '29',
  '9': '24',
  '10': '34',
  n_zt: 1, // 涨停数
  n_dt: 1, // 跌停数
  n_sjzt: 1, // 实际涨停
  n_sjdt: 1, // 实际跌停
  n_zt_st: 1, // ST涨停数
  n_dt_st: 1, // ST跌停数
  n_up: 2718, // 上涨数
  n_down: 1222, // 下跌数
  v_ca: 1, // A股成交量
  v_sh: 1, // 上证成交量
  v_ca_zr: 1, // 昨日A股成交量
  v_sh_zr: 1, // 昨日上证成交量
  zdfb: '553,1354,38,238,702,15,96,200,4,17,73,0,81,94,7,295,536,24,', // 实际涨跌分布（排除ST）
  date: '20220711', // 日期
  ...baoer,
  ...fund,
}

export type IEnvironment = IDocument<typeof data>

const zdfbIndexMap = ['-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].reduce(
  (acc, i) => ({ ...acc, [i]: { oriName: i } }),
  {}
)
export const {
  fullConfig: environmentConfig,
  map: environmentMap,
  strNameMap: environmentStrNameMap,
  oriDataKeys: environmentOriDataKeys,
  schemaGetter: environmentSchemaGetter,
  modelGetter: environmentGetter,
  schema: EnvironmentSchema,
  model: Environment,
} = new ModelFactory<IEnvironment>('environment', data, {
  ...zdfbIndexMap,
  n_zt: { oriName: 'ZT' },
  n_dt: { oriName: 'DT' },
  n_sjzt: { oriName: 'SJZT' },
  n_sjdt: { oriName: 'SJDT' },
  n_zt_st: { oriName: 'STZT' },
  n_dt_st: { oriName: 'STDT' },
  n_up: { oriName: 'SZJS' },
  n_down: { oriName: 'XDJS' },
  v_ca: { oriName: 'qscln' },
  v_sh: { oriName: 'szln' },
  v_ca_zr: { oriName: 'q_zrtj' },
  v_sh_zr: { oriName: 's_zrtj' },
  zdfb: { oriName: 'ZSZDFB' },
  date: { oriName: 'date' },
  temperature: { oriName: 'market_temperature' },
  broken_c: { oriName: 'limit_up_broken_count' },
  broken_r: { oriName: 'limit_up_broken_ratio' },
  zt_avg_zr: { oriName: 'yesterday_limit_up_avg_pcp' },
  time_baoer: { oriName: 'timestamp' },
})

export default environmentGetter
