# -*- coding: utf-8 -*-
import sys
import win32con
import win32gui
import time
from ctypes import *
from ctypes.wintypes import DWORD, HANDLE, HWND, MSG, WPARAM, LPARAM, LONG, MSG

EVENT_SYSTEM_DIALOGSTART = 0x0010
WINEVENT_OUTOFCONTEXT = 0x0000

user32 = windll.user32
ole32 = windll.ole32

ole32.CoInitialize(0)

WinEventProcType = WINFUNCTYPE(
    None,
    HANDLE,
    DWORD,
    HWND,
    LONG,
    LONG,
    DWORD,
    DWORD
)


def callback(hWinEventHook, event, hwnd, idObject, idChild, dwEventThread, dwmsEventTime):
    length = user32.GetWindowTextLengthA(hwnd)
    buff = create_string_buffer(length + 1)
    user32.GetWindowTextA(hwnd, buff, length + 1)
    print(buff.value)


WinEventProc = WinEventProcType(callback)

user32.SetWinEventHook.restype = HANDLE
hook = user32.SetWinEventHook(
    EVENT_SYSTEM_DIALOGSTART,
    EVENT_SYSTEM_DIALOGSTART,
    0,
    WinEventProc,
    0,
    0,
    WINEVENT_OUTOFCONTEXT
)
if hook == 0:
    print('SetWinEventHook failed')
    sys.exit(1)

msg = MSG()
while user32.GetMessageW(byref(msg), 0, 0, 0) != 0:
    print(msg.message)
    user32.TranslateMessageW(msg)
    user32.DispatchMessageW(msg)

user32.UnhookWinEvent(hook)
ole32.CoUninitialize()
