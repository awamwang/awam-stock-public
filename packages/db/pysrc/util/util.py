# -*- coding: UTF-8 -*-

import time
import random
import pydash

def sleep(min=4, max=9):
    time.sleep(random.randint(min, max))

def is_part_equal(dicta, dictb):
    new_dictb = pydash.pick(dictb, list(dicta.keys()))
    return pydash.is_equal(dicta, new_dictb)
