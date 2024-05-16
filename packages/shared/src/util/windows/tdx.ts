import ffi from 'ffi-napi'
import * as ref from 'ref-napi'
import { Pointer, NULL, NULL_POINTER } from 'ref-napi'
import refStruct from 'ref-struct-di'
import WCHAR_T from 'ref-wchar-napi'
import { TextEncoder } from 'node:util'

const Struct = refStruct(ref)

const VOID = ref.types.void
const UINT = ref.types.uint
const ULONG = ref.types.ulong
const CHAR = ref.types.char
const STRING = ref.types.CString
const POINTER = ref.refType(VOID)
const ULONG_P = ref.refType(ULONG)
const CHAR_P = ref.refType(CHAR)

const LRESULT = ref.types.long
const WPARAM = ref.types.uint
const LPARAM = ref.types.long
const UWM_STOCK = 50067 // RegisterWindowMessage(_T('Stock'))

const WCHAR_T_P = ref.refType(WCHAR_T)

const COPYDATA = new Struct({
  dwData: ULONG_P,
  cbData: ULONG,
  lpData: POINTER,
})

// UINT RegisterWindowMessage( lpString);
const User32 = new ffi.Library('user32.dll', {
  FindWindowW: [POINTER, [WCHAR_T_P, WCHAR_T_P]],
  // SendMessageW: [LRESULT, [POINTER, UINT, WPARAM, ref.refType(COPYDATA)]],
  SendMessageW: [LRESULT, [POINTER, UINT, WPARAM, LPARAM]],
  // SendMessageW: [LRESULT, [POINTER, UINT, WPARAM, ref.refType(LPARAM)]],
  RegisterWindowMessageW: [UINT, [STRING]],
  SetForegroundWindow: [VOID, [POINTER]],
})
// const Core = new ffi.Library('coredll.dll', {
// })

// const stockStr = new TextEncoder().encode(JSON.stringify('Stock') + '\0')
// const UWM_STOCK = User32.RegisterWindowMessageW('Stock')
// console.log(User32.RegisterWindowMessageW(JSON.stringify('Stock') + '\0'), stockStr)
const tdxClass = Buffer.from('TdxW_MainFrame_Class\0', 'ucs2')
const tdxTitle = Buffer.from('通达信金融终端V7.59 - [版面-宽短线盯盘]\0', 'ucs2')
const thsTitle = Buffer.from('同花顺(v9.10.30) - 上海Level-2分时走势\0', 'ucs2')
// const hwnd = User32.FindWindowW(tdxClass as any, null as any)
const hwnd = User32.FindWindowW(null as any, thsTitle as any)
User32.SetForegroundWindow(hwnd)

const msg = JSON.stringify('Stock') + '\0'
const length = new TextEncoder().encode(msg).length
const data = COPYDATA()
data.dwData = NULL as any
data.cbData = length
data.lpData = ref.allocCString(msg) as unknown as Pointer<any>

// User32.SendMessageW(hwnd, 0x004a, 0, data.ref())
User32.SendMessageW(hwnd, UWM_STOCK, 7600028, 0)

console.log('done')

// 加载动态库中的ceil取整函数

// const libm = ffi.Library('libm', {
//   ceil: ['double', ['double']],
// })
// libm.ceil(1.5) // 2

// // 调用
// libm.ceil(1.5) // 2
