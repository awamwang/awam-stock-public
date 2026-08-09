import koffi from 'koffi'

const UWM_STOCK = 50067 // RegisterWindowMessage(_T('Stock'))

const user32 = koffi.load('user32.dll')
const FindWindowW = user32.func('void * __stdcall FindWindowW(str16 lpClassName, str16 lpWindowName)')
const SendMessageW = user32.func('long __stdcall SendMessageW(void *hWnd, uint Msg, uintptr wParam, intptr lParam)')
const SetForegroundWindow = user32.func('bool __stdcall SetForegroundWindow(void *hWnd)')

const thsTitle = '同花顺(v9.10.30) - 上海Level-2分时走势'
const hwnd = FindWindowW(null, thsTitle)
SetForegroundWindow(hwnd)
SendMessageW(hwnd, UWM_STOCK, 7600028, 0)

console.log('done')
