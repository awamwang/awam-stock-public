# 数据返回格式速查

> 所有端点都返回 JSON。下面是 4 种主要 schema,**LLM 必须先知道结构才能正确解析**。

---

## 1. TablePayload(主力格式)

凡是查时间序列 / 单日快照的端点都返回这个结构。**`data` 是二维数组,不是对象数组**——LLM 经常误以为是 `[{...}]`,要按列名顺序拆。

**端点**:
- `/v1/feargreed/{category}/{code}` (所有 5 个 category)
- `/v1/stock/{code}`
- `/v1/sectors/{code}/history` (Pro / Pro+)

**结构**:
```json
{
  "metadata": {
    "category": "a_stock_macro",
    "category_name": "A股宏观恐贪指数",
    "code": "shi_feargreedindex",
    "name": "上证恐贪指数",
    "period": "7d",
    "latest_date": "2026-05-13",
    "columns": ["date", "price", "feargreed_index"]
  },
  "data": [
    ["2026-04-29", 11.52, 84.73],
    ["2026-04-30", 11.49, 86.26],
    ["2026-05-06", 11.36, 83.7]
  ]
}
```

**解析方法**:
```python
columns = payload["metadata"]["columns"]       # ["date", "price", "feargreed_index"]
fg_idx  = columns.index("feargreed_index")     # 2
latest  = payload["data"][-1][fg_idx]          # 最新一期的恐贪值
```

**字段说明**:
- `date` — YYYY-MM-DD,**只有交易日**;周末 / 法定节假日缺失
- `price` — 该标的的收盘价(个股是后复权价;商品是主力合约价;指数是收盘点位 —— `a_stock_macro` 对应**上证综合指数 000001.SH**,`hk_stock_macro` 对应**恒生指数 HSI**)
- `feargreed_index` — 0~100 的连续值
- **行按时间升序**(最早在前,最新在最后),用 `[-1]` 拿最新

---

## 2. List Payload(标的列表)

**端点**:
- `/v1/feargreed/a_stock_sectors/list` — 407 个板块
- `/v1/feargreed/a_stock_individual/list` — 2000+ 只 A 股
- `/v1/feargreed/commodity/list` — 56 个商品 (Pro+)

**结构**:
```json
{
  "metadata": {
    "category": "a_stock_sectors",
    "category_name": "A股板块恐贪指数",
    "count": 407
  },
  "data": [
    {"code": "sector0001", "name": "参股保险"},
    {"code": "sector0002", "name": "天津自贸区"}
  ]
}
```

`data` 是对象数组(跟 TablePayload 不一样!),每个对象有 `code` + `name`。

---

## 3. 单 code 类别 — 无 /list 端点

**`a_stock_macro` 和 `hk_stock_macro` 各只有 1 个 code**,后端**没有 /list 端点**(直接调会 404)。

| category | 唯一 code | name |
|---|---|---|
| `a_stock_macro` | `shi_feargreedindex` | 上证恐贪指数 |
| `hk_stock_macro`(Pro/Pro+) | `hsi_feargreedindex` | 恒指恐贪指数 |

skill 的 `macro_targets.py` / `list_targets.py macro` 已经把这种情况做了本地化处理——不会真去请求 /list 端点。

---

## 4. 公开端点(无 key 即用)

**端点**:`/v1/public/feargreed/latest`(对应 `public_snapshot.py`)

**结构**(扁平,不是 TablePayload):
```json
{
  "category": "a_stock_macro",
  "code": "shi_feargreedindex",
  "latest_date": "2026-05-13",
  "sh_index": 4242.572,
  "feargreed_index": 95.1,
  "sentiment_label": "乐观",
  "source": "latest_json",
  "fetched_at": "2026-05-14T06:59:36.632205+00:00",
  "stale_seconds": 0,
  "is_stale": false
}
```

**字段说明**:
- `sentiment_label` — 中文标签,基于 feargreed_index 自动给出(`极度悲观` / `悲观` / `中性` / `乐观` / `极度乐观`),LLM 转述给英文用户时翻译即可
- `stale_seconds` — 距上次数据更新过了多少秒
- `is_stale` — 是否过期(超过 600 秒 = `PUBLIC_FG_STALE_SECONDS`)

---

## 5. 错误响应

```json
{ "detail": "data not found" }                                           // 404 — code 在该 category 下不存在
{ "detail": "invalid period, valid values: ['180d','1y','30d','3y','5y']" } // 400 — period 不合法
{ "detail": "upgrade required" }                                         // 403 — 当前套餐不能访问
{ "detail": "daily limit exceeded" }                                     // 429 — 配额用完
{ "detail": "missing api key" }                                          // 401 — 没带 X-API-Key header
```

LLM 接到 `detail` 字段时,**用里面的信息直接告诉用户怎么修**(改 period / 升级套餐 / 等次日等),不要照搬英文错误码。

---

## 6. 各 category 的 code 格式速查 ⭐

| category | code 格式 | 例子 | 如何查代码 |
|---|---|---|---|
| `a_stock_macro` | 固定 1 个 | `shi_feargreedindex` | 见第 3 节(无 /list) |
| `hk_stock_macro` | 固定 1 个 | `hsi_feargreedindex` | 见第 3 节(无 /list) |
| `a_stock_sectors` | `sectorXXXX`(全小写 + 4 位数字) | `sector0001` | `python scripts/list_targets.py a_stock_sectors` |
| `a_stock_individual` | 6 位代码 + 交易所后缀 | `000001.SZ` / `600519.SH` | `python scripts/list_targets.py a_stock_individual` |
| `commodity` | 纯字母(无数字后缀) | `AU` / `SC` / `CU` | `python scripts/list_targets.py commodity` (Pro+) |

**代码大小写敏感**——`AU` 行 `au` 不行;`sector0001` 行 `Sector0001` / `SECTOR0001` 不行。

---

## 7. AI 应当如何选择 period

| period | 行数大致 | 适合用户问的 |
|---|---|---|
| `latest` | 1 | "今天怎么样" — **0 配额开销** |
| `7d` | ~5(只算交易日) | "本周" / "最近几天" |
| `30d` | ~22 | "最近一个月" / 短期趋势 |
| `180d` | ~120 | "近半年" / 中期定位 |
| `1y` | ~245 | "今年" / 年度复盘 |
| `3y` | ~735 (Pro+) | 长期复盘 |
| `all` | 全量历史 (Pro+) | "历史相似度" / 极端事件统计 |

**重要**:5y 仅适用于个股价格 `/v1/stock/{code}?period=5y`,**恐贪指数没有 5y 桶**。

简单查询(`latest`)直接答。长序列建议加 `--summary` 让 skill 脚本只回 5 行 + min/max/avg/latest,省 token。
