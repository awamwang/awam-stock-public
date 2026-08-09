import koffi from 'koffi'

// 通过 koffi 加载 user32.dll
const user32 = koffi.load('user32.dll')
const MessageBoxW = user32.func('int __stdcall MessageBoxW(void *hWnd, str16 lpText, str16 lpCaption, uint uType)')

// 调用 user32.dll 中的 MessageBoxW() 函数, 弹出一个对话框
const isOk = MessageBoxW(null, 'I am Node.JS!', 'Hello, World!', 1)
console.log(isOk)
