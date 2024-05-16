import ffi from 'ffi-napi'

function windowsText(text: string) {
  return new Buffer(text, 'ucs2').toString('binary')
}
// 通过ffi加载user32.dll
const myUser32 = new ffi.Library('user32', {
  // 声明这个dll中的一个函数
  MessageBoxW: [
    'int32',
    ['int32', 'string', 'string', 'int32'], // 用json的格式罗列其返回类型和参数类型
  ],
})

// 调用user32.dll中的MessageBoxW()函数, 弹出一个对话框
const isOk = myUser32.MessageBoxW(0, windowsText('I am Node.JS!'), windowsText('Hello, World!'), 1)
console.log(isOk)
