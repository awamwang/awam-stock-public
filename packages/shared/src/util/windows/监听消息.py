# -*- coding: utf-8 -*-
from multiprocessing import process
import threading
import ctypes.wintypes
import ctypes
import win32api
import win32con
import win32gui
import os

shotControl_command = False
exitControl_command = False


class myScreenShot(threading.Thread):
    def __init__(self, name):
        threading.Thread.__init__(self)
        self.name = name

    def run(self):
        print("\n***start of "+str(self.name)+"***\n")
        sreenShotMain()
        print("\n***end of "+str(self.name)+"***\n")


class myHotKey(threading.Thread):
    def __init__(self, name):
        threading.Thread.__init__(self)
        self.name = name

    def run(self):
        print("\n***start of "+str(self.name)+"***\n")
        hotKeyMain()
        print("\n***end of "+str(self.name)+"***\n")
        process.exit(0)


def sreenShotMain():
    global shotControl_command
    global exitControl_command
    while(True):
        if exitControl_command == True:
            exitControl_command = False
            print("exit this program!")
            return
        if shotControl_command == True:
            # screen shot
            print("ScreenShot program is replaced by print")
            shotControl_command = False


def hotKeyMain():
    global shotControl_command
    global exitControl_command
    user32 = ctypes.windll.user32
    hld = win32gui.FindWindow(None, u"同花顺(v9.10.30) - 深圳Level-2分时走势")

    while(True):
        # win+f9=screenshot
        if not user32.RegisterHotKey(None, 98, win32con.MOD_WIN, win32con.VK_F9):
            print("Unable to register id", 98)
        # win+f10=exit program
        if not user32.RegisterHotKey(None, 99, win32con.MOD_WIN, win32con.VK_F10):
            print("Unable to register id", 99)
        try:
            msg = ctypes.wintypes.MSG()
            if user32.GetMessageW(ctypes.byref(msg), None, 0, 0) != 0:
                print('message', msg.message)
                if msg.message == win32con.WM_SETTEXT:
                    print(msg.wParam, msg.lParam)
                if msg.message == win32con.WM_HOTKEY:
                    if msg.wParam == 99:
                        exitControl_command = True
                        return
                    elif msg.wParam == 98:
                        shotControl_command = True
                user32.TranslateMessage(ctypes.byref(msg))
                user32.DispatchMessageA(ctypes.byref(msg))
        finally:
            del msg
            user32.UnregisterHotKey(None, 98)
            user32.UnregisterHotKey(None, 99)


if __name__ == "__main__":
    thread_screenShot = myScreenShot("thread_screenShot")
    thread_hotKey = myHotKey("thread_hotKey")
    thread_screenShot.start()
    thread_hotKey.start()

    thread_hotKey.join()
    thread_screenShot.join()
