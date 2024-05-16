# -*- coding: utf-8 -*-
import sys
import win32con
import win32gui
from ctypes import *
from ctypes.wintypes import DWORD, HHOOK, HINSTANCE, MSG, WPARAM, LPARAM

user32 = CDLL("user32.dll")
kernel32 = CDLL("kernel32.dll")


class KBDLLHOOKSTRUCT(Structure):
    _fields_ = [
        ('vkCode', DWORD),
        ('scanCode', DWORD),
        ('flags', DWORD),
        ('time', DWORD),
        ('dwExtraInfo', DWORD)]


def uninstallHookProc(hooked):
    if hooked is None:
        return
    user32.UnhookWindowsHookEx(hooked)
    hooked = None


def hookProc(nCode, wParam, lParam):
    if nCode < 0:
        return user32.CallNextHookEx(hooked, nCode, wParam, lParam)
    else:
        print(nCode)
        if wParam == win32con.WM_SETTEXT:
            print(lParam)
            pass

        if wParam == 256:
            if 162 == lParam.contents.value:
                print("Ctrl pressed, call Hook uninstall()")
                uninstallHookProc(hooked)
                sys.exit(-1)
            capsLock = user32.GetKeyState(20)
            # kb_struct = cast(lParam, POINTER(KBDLLHOOKSTRUCT))
            if lParam.contents.value == 13:
                print("\n")
            elif capsLock:
                print(chr(lParam.contents.value), end="")
            else:
                print(chr(lParam.contents.value+32), end="")
    return user32.CallNextHookEx(hooked, nCode, wParam, lParam)


def startKeyLog():
    msg = MSG()
    user32.GetMessageA(byref(msg), 0, 0, 0)


def installHookProc(hooked, pointer):
    # hld = win32gui.FindWindow(None, u"windows消息查询器   福仔出品")
    hld = win32gui.FindWindow(None, u"同花顺(v9.10.30) - 宽短线盯盘")
    hdd = kernel32.GetModuleHandleW('FfiTest.dll')
    # hld = win32gui.FindWindow(None, u"FfiTest.dll")
    print(kernel32.GetModuleHandleW('FfiTest.dll'),
          hld, kernel32.GetModuleHandleW())
    # hooked = user32.SetWindowsHookExA(
    #     win32con.WH_KEYBOARD_LL,  # 13
    #     pointer,
    #     kernel32.GetModuleHandleW(),
    #     0
    # )
    hooked = user32.SetWindowsHookExA(
        win32con.WH_GETMESSAGE,
        # win32con.WH_KEYBOARD_LL,
        pointer,
        kernel32.GetModuleHandleW(),
        # hdd,
        # 0xC4162C,
        0
    )
    if not hooked:
        print('not hooked', windll.kernel32.GetLastError())
        return False
    return True


HOOKPROC = WINFUNCTYPE(c_int, c_int, c_int, POINTER(DWORD))
pointer = HOOKPROC(hookProc)
hooked = None
if installHookProc(hooked, pointer):
    print("Hook installed")
    try:
        msg = MSG()
        user32.GetMessageA(byref(msg), 0, 0, 0)
    except KeyboardInterrupt as kerror:
        uninstallHookProc(hooked)
        print("Hook uninstall...")
else:
    print("Hook installed error")
