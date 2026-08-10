/** 根据主机与端口拼出后端 origin（远程默认 https，本机默认 http；省略 80/443） */
export function buildServerOrigin(host: string, port?: string | number) {
  const h = String(host || '').trim() || 'localhost'
  const isLocalHost = h === 'localhost' || h === '127.0.0.1'
  const protocol = isLocalHost ? 'http' : 'https'
  const portNum = port === undefined || port === '' ? NaN : Number(port)
  const defaultPort = protocol === 'https' ? 443 : 80

  if (!Number.isFinite(portNum) || portNum === defaultPort) {
    return `${protocol}://${h}`
  }
  return `${protocol}://${h}:${portNum}`
}
