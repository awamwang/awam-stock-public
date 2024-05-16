declare module 'ref-wchar-napi' {
  import { NamedTypeLike } from 'ref-napi'

  declare let WCHAR_T: NamedTypeLike

  export default WCHAR_T
  export = WCHAR_T
}
