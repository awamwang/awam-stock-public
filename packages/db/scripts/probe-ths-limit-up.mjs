/**
 * 同花顺涨停池本地探测（零依赖，不依赖 shared dist）
 * 用法：node packages/db/scripts/probe-ths-limit-up.mjs
 * 可选：node packages/db/scripts/probe-ths-limit-up.mjs 20260811
 */
const dateArg = process.argv[2]
const now = new Date()
const ymd =
  dateArg ||
  `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`

const field =
  '199112,10,9001,330323,330324,330325,9002,330329,133971,133970,1968584,3475914,9003,9004'
const qs = new URLSearchParams({
  page: '1',
  limit: '5',
  field,
  filter: 'HS,GEM2STAR,ST',
  order_field: '330324',
  order_type: '0',
  date: ymd,
})

const url = `https://data.10jqka.com.cn/dataapi/limit_up/limit_up_pool?${qs}`

const res = await fetch(url, {
  headers: {
    accept: 'application/json, text/plain, */*',
    'accept-language': 'zh-CN,zh;q=0.9',
    origin: 'https://data.10jqka.com.cn',
    referer: 'https://data.10jqka.com.cn/',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  },
})

const text = await res.text()
if (!res.ok) {
  console.error(`HTTP ${res.status}`, text.slice(0, 500))
  process.exit(1)
}

const body = JSON.parse(text)
if (body.status_code !== 0) {
  console.error('业务失败', body.status_code, body.status_msg)
  process.exit(1)
}

const list = body.data?.info ?? []
const total = body.data?.page?.total ?? list.length
const ztNum = body.data?.limit_up_count?.today?.num

console.log(`[ths] ok date=${body.data?.date} trade=${body.data?.trade_status?.name ?? '-'} total=${total} ztNum=${ztNum ?? '-'}`)
for (const item of list) {
  console.log(
    `  ${item.code} ${item.name} ${item.high_days ?? ''} 涨幅=${item.change_rate ?? '-'}% 现价=${item.latest ?? '-'} 原因=${item.reason_type ?? '-'}`
  )
}
