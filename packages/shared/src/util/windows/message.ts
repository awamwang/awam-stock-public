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
const POINTER = ref.refType(VOID)
const ULONG_P = ref.refType(ULONG)
const CHAR_P = ref.refType(CHAR)

const LRESULT = ref.types.long
const WPARAM = ref.types.uint
const LPARAM = ref.types.long

const WCHAR_T_P = ref.refType(WCHAR_T)

const COPYDATA = new Struct({
  dwData: ULONG_P,
  cbData: ULONG,
  lpData: POINTER,
})

const User32 = new ffi.Library('user32.dll', {
  FindWindowW: [POINTER, [WCHAR_T_P, WCHAR_T_P]],
  SendMessageW: [LRESULT, [POINTER, UINT, WPARAM, ref.refType(COPYDATA)]],
  // SendMessageW: [LRESULT, [POINTER, UINT, WPARAM, ref.refType(LPARAM)]],
})

const tdxClass = Buffer.from('TdxW_MainFrame_Class\0', 'ucs2')
const testTitle = Buffer.from('win32gui\0', 'ucs2')
// let hwnd = User32.FindWindowW(testClass, null)
const hwnd = User32.FindWindowW(null as any, testTitle as any)
// const hwnd = User32.FindWindowW(NULL_POINTER, Buffer.from('win32gui\0', 'ucs2') as Pointer<any>)

const msg = JSON.stringify('Stock') + '\0'
const length = new TextEncoder().encode(msg).length
const data = COPYDATA()
data.dwData = NULL as any
data.cbData = length
data.lpData = ref.allocCString(msg) as unknown as Pointer<any>

User32.SendMessageW(hwnd, 0x004a, 0, data.ref())

console.log('done')

// 加载动态库中的ceil取整函数

// const libm = ffi.Library('libm', {
//   ceil: ['double', ['double']],
// })
// libm.ceil(1.5) // 2

// // 调用
// libm.ceil(1.5) // 2
