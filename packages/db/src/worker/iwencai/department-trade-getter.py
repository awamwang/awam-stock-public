#!/bin/env python
# -*- coding: UTF-8 -*-

# import datetime
import json
import pydash
import wencai as wc
import time

from pysrc.util import sleep
from pysrc.db import db


class TradeGetter(object):
    """docstring for TradeGetter."""

    def __init__(self, arg):
        super(TradeGetter, self).__init__()

    def get_trades(self, arg):
        return wc.search(query='营业部龙虎榜')


def main():
    # print('[py]risky-department开始执行')
    try:
        date = time.strftime("%Y%m%d", time.localtime(time.time()))

        has = db.departmentTrade.find_one({'上榜日期': date})
        if (has):
            print('跳过营业部龙虎榜执行')
            return

        result = wc.search(query='营业部龙虎榜')
        resultJson = json.loads(result.T.to_json()).values()

        if (not pydash.predicates.is_empty(resultJson)):
            db.departmentTrade.insert_many(resultJson)

        # db['global'].update_one({'type': 'lastTradeDate'}, {
        #     '$set': {'value': date}}, upsert=True)

    finally:
        db.client.close()

    print('[py]department-trade执行完成')


if __name__ == '__main__':
    main()
