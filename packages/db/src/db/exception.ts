export function ignoreDbError(err: any) {
  if (err.errmsg && err.errmsg.indexOf('duplicate key error') > -1) {
    return
  }

  throw err
}
