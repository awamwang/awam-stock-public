import koffi from 'koffi'

const COPYDATASTRUCT = koffi.struct('COPYDATASTRUCT', {
  dwData: 'uintptr',
  cbData: 'uint32',
  lpData: 'void *',
})

const user32 = koffi.load('user32.dll')
const FindWindowW = user32.func('void * __stdcall FindWindowW(str16 lpClassName, str16 lpWindowName)')
const SendMessageW = user32.func('long __stdcall SendMessageW(void *hWnd, uint Msg, uintptr wParam, COPYDATASTRUCT *lParam)')

const testTitle = 'win32gui'
const hwnd = FindWindowW(null, testTitle)

const msg = Buffer.from(JSON.stringify('Stock') + '\0', 'utf8')
const data = {
  dwData: 0,
  cbData: msg.length,
  lpData: msg,
}

SendMessageW(hwnd, 0x004a, 0, data)

console.log('done')
