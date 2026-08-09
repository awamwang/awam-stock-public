import path from 'path'
import koffi from 'koffi'

// 通过 koffi 加载 myAddDll.dll
const myAddDll = koffi.load(path.resolve(__dirname, './FfiTest'))
const funAdd = myAddDll.func('int funAdd(int a, int b)')

// 调用函数, 参数1和2, 将返回值直接打印出来, 预计为3
const result = funAdd(1, 2)
console.log(`the result of 1 + 2 is: ` + result)
