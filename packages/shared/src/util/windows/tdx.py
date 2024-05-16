# -*- coding: UTF-8 -*-
import win32api
import win32gui
from win32con import HWND_BROADCAST, WM_SETTEXT, WH_KEYBOARD_LL, WH_GETMESSAGE, WM_GETTEXTLENGTH, WM_GETTEXT
import ctypes
user32 = ctypes.windll.user32


def filter_hwnd(hwnd, list):
    if win32gui.IsWindow(hwnd) and win32gui.IsWindowEnabled(hwnd) and win32gui.IsWindowVisible(hwnd):
        list.append(hwnd)

def get_windows(className=None, title=None):
    '''
    获得所有窗口句柄
     返回窗口句柄列表
     '''
    hwndChildList = []

    win32gui.EnumWindows(filter_hwnd, hwndChildList)

    if className:
        hwndChildList = [
            hwnd for hwnd in hwndChildList if win32gui.GetClassName(hwnd) == className]

    if title:
        hwndChildList = [
            hwnd for hwnd in hwndChildList if title in win32gui.GetWindowText(hwnd)]

    return hwndChildList

def get_child_windows(parent, className=None, title=None):
    '''
    获得parent的所有子窗口句柄
     返回子窗口句柄列表
     '''
    if not parent:
        return

    hwndChildList = []

    win32gui.EnumChildWindows(parent, filter_hwnd, hwndChildList)

    if className:
        hwndChildList = [
            hwnd for hwnd in hwndChildList if win32gui.GetClassName(hwnd) == className]

    if title:
        hwndChildList = [
            hwnd for hwnd in hwndChildList if title in win32gui.GetWindowText(hwnd)]

    return hwndChildList


# def hookProc(nCode, wParam, lParam):
#     if nCode < 0:
#         return user32.CallNextHookEx(None, nCode, wParam, lParam)
#     else:
#         print(nCode)
#         pass

#     return user32.CallNextHookEx(None, nCode, wParam, lParam)


# user32.SetWindowsHookExW(WH_GETMESSAGE, hookProc, None, 0)
# SetWinEventHook
# 返回窗口标题为Adobe Acrobat的句柄
# hld = win32gui.FindWindow(None, u"通达信金融终端V7.59 - [版面-宽短线盯盘]")
# hld = win32gui.FindWindow(None, u"同花顺(v9.10.30) - 深圳Level-2分时走势")
# hld = win32gui.FindWindow(None, u"同花顺(v9.10.30) - 宽短线盯盘")
hld = win32gui.FindWindow(u'Afx:00400000:b:00010005:00000006:01A532A3', None)
hwnd1 = win32gui.FindWindow(u'#32770', None)
# print('xxx', win32gui.GetWindowText(hwnd1))
# hld = win32gui.FindWindow(u"TdxW_MainFrame_Class",None) #返回窗口标题为Adobe Acrobat的句柄
# win32gui.SetForegroundWindow(hld)

ths_hwnds = get_windows(title='同花顺')
print(ths_hwnds)
for w in ths_hwnds:
    print(win32gui.GetWindowText(w))
    print(win32gui.GetClassName(w))

hwnds = get_child_windows(hld, title='逐笔成交--')
print(hwnds)
for w in hwnds:
    print(win32gui.GetWindowText(w))
    print(win32gui.GetClassName(w))


UWM_STOCK = win32api.RegisterWindowMessage("Stock")
# MSG = 30788
MSG = 0x04BF
# MSG = UWM_STOCK
# win32api.PostMessage(hld,UWM_STOCK,7600029,0);
# win32api.PostMessage(hld, MSG, 0x22DA3838, 0)
# win32api.PostMessage(hld, WM_SETTEXT, 0, 0)
# win32api.PostMessage(hld, 0x111, 31067, 0)
# win32api.SendMessage(HWND_BROADCAST, WM_SETTEXT, 0,
#                      u"同花顺(v9.10.30) - 深圳Level-2分时走势")



length = win32api.SendMessage(hld, WM_GETTEXTLENGTH) + 1
print('Length: ', length)
buf = '0' * length
# 获取文本框内容
print('get: ', win32api.SendMessage(hld, WM_GETTEXT, length, buf))
print(buf)

print(ctypes.windll.kernel32.GetLastError())

# titles = set()

# def foo(hwnd, mouse):
#     # 去掉下面这句就所有都输出了，但是我不需要那么多
#     if win32gui.IsWindow(hwnd) and win32gui.IsWindowEnabled(hwnd) and win32gui.IsWindowVisible(hwnd):
#         titles.add(win32gui.GetWindowText(hwnd))


# def test():
#     win32gui.EnumWindows(foo, 0)
#     lt = [t for t in titles if t]
#     lt.sort()
#     for t in lt:
#         print(t)


# if __name__ == '__main__':
#     test()

# 获取股票代码
# SendMessage,0x111,33780,0,,ahk_class TdxW_MainFrame_Class
# MsgBox %Clipboard%
