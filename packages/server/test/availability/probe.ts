/** 截断响应正文，便于在断言失败时展示 */
export function truncateBody(body: string, max = 800): string {
  if (body.length <= max) {
    return body
  }
  return `${body.slice(0, max)}...(已截断, 总长 ${body.length})`
}

export interface ProbeResult<T = any> {
  url: string
  status: number
  data: T
  raw: string
}

/**
 * 发起可用性探测请求；失败时抛出含 URL / 状态码 / 响应正文的错误
 */
export async function probeJson<T = any>(label: string, url: string, options?: RequestInit): Promise<ProbeResult<T>> {
  let response: Response
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json, text/plain, */*',
        ...(options?.headers || {}),
      },
    })
  } catch (err: any) {
    throw new Error(`[${label}] 网络请求失败: ${err?.message || err}\nURL: ${url}`)
  }

  const raw = await response.text()
  if (!response.ok) {
    throw new Error(`[${label}] HTTP ${response.status} ${response.statusText}\nURL: ${url}\nBody: ${truncateBody(raw)}`)
  }

  let data: T
  try {
    data = JSON.parse(raw) as T
  } catch {
    throw new Error(`[${label}] 响应不是合法 JSON\nURL: ${url}\nBody: ${truncateBody(raw)}`)
  }

  return { url, status: response.status, data, raw }
}

/** 要求已配置环境变量，否则抛出可读错误 */
export function requireEnv(name: string, label: string): string {
  const value = process.env[name]?.trim() || ''
  if (!value) {
    throw new Error(`[${label}] 未配置环境变量 ${name}，请在 packages/db/envs 中补充后重试`)
  }
  return value
}

/** 按大小写不敏感方式读取字段 */
export function pickField(data: any, key: string): any {
  if (data == null || typeof data !== 'object') {
    return undefined
  }
  if (data[key] != null) {
    return data[key]
  }
  const lower = key.toLowerCase()
  const matched = Object.keys(data).find((k) => k.toLowerCase() === lower)
  return matched ? data[matched] : undefined
}

/** 开盘啦业务错误码检测（HTTP 200 时仍可能返回 errcode） */
export function assertLongTouPayload(label: string, data: any, expectedKey: string) {
  if (data == null || typeof data !== 'object') {
    throw new Error(`[${label}] 响应为空或格式异常: ${truncateBody(JSON.stringify(data))}`)
  }

  const errcode = pickField(data, 'errcode')
  if (errcode != null && String(errcode) !== '0') {
    const errmsg = pickField(data, 'errmsg') ?? pickField(data, 'msg') ?? pickField(data, 'Message') ?? ''
    throw new Error(`[${label}] 开盘啦返回错误: errcode=${errcode}, errmsg=${errmsg}\nBody: ${truncateBody(JSON.stringify(data))}`)
  }

  if (data.error != null || data.Error != null) {
    throw new Error(`[${label}] 开盘啦返回错误字段: ${truncateBody(JSON.stringify(data))}`)
  }

  if (pickField(data, expectedKey) == null) {
    throw new Error(`[${label}] 缺少预期字段 "${expectedKey}"\nBody: ${truncateBody(JSON.stringify(data))}`)
  }
}
