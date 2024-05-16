import ffi from 'ffi-napi'
import path from 'path'

// 通过ffi加载myAddDll.dll
const myAddDll = new ffi.Library(path.resolve(__dirname, './FfiTest'), {
  // 声明这个dll中的一个函数
  funAdd: [
    'int',
    ['int', 'int'], // 用json的格式罗列其返回类型和参数类型
  ],
})

// 调用函数, 参数1和2, 将返回值直接打印出来, 预计为3
const result = myAddDll.funAdd(1, 2)
console.log(`the result of 1 + 2 is: ` + result)
