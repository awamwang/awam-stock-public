import win32con, win32api, win32gui, ctypes, ctypes.wintypes
from ctypes import *

class COPYDATASTRUCT(Structure):
    _fields_ = [('dwData', POINTER(c_uint)),
                ('cbData', c_uint),
                ('lpData', c_char_p)]

PCOPYDATASTRUCT = POINTER(COPYDATASTRUCT)

class Listener:

    def __init__(self):
        message_map = {
            win32con.WM_COPYDATA: self.OnCopyData
        }
        wc = win32gui.WNDCLASS()
        wc.lpfnWndProc = message_map
        wc.lpszClassName = 'MyWindowClass'
        hinst = wc.hInstance = win32api.GetModuleHandle(None)
        classAtom = win32gui.RegisterClass(wc)
        self.hwnd = win32gui.CreateWindow (
            classAtom,
            "win32gui",
            0,
            0,
            0,
            win32con.CW_USEDEFAULT,
            win32con.CW_USEDEFAULT,
            0,
            0,
            hinst,
            None
        )
        print(self.hwnd)

    def OnCopyData(self, hwnd, msg, wparam, lparam):
        copydata = ctypes.cast(lparam, PCOPYDATASTRUCT).contents
        print (copydata.cbData)
        data = copydata.lpData[:copydata.cbData - 1]
        print (data.decode('utf-8'))
        return 1

l = Listener()
win32gui.PumpMessages()