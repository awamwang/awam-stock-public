import os
import datetime
import pydash
import pandas as pd
from pytdx.reader import BlockReader, CustomerBlockReader
from pytdx.reader.block_reader import BlockReader_TYPE_FLAT, BlockReader_TYPE_GROUP

from pysrc.db import db
from pysrc.util import is_part_equal

TDX_DIR = os.getenv('AWST_TDX_DIR', default='C:\\Program Files\\通达信')
TDX_HQ_DIR = TDX_DIR + '/T0002/hq_cache'


def read_block_code_map():
    with open(TDX_HQ_DIR + '/tdxzs.cfg', 'r', encoding='gbk') as f:
        lines = f.readlines()
        data = [line.strip().split('|')[0:2] for line in lines]
        df = pd.DataFrame(data, columns=['blockname', 'code'])

    return df


def save_block(df, block_type: str):
    count = 0
    # 当block_type为fg时，tags为['hidden']，否则为空
    tags = ['hidden'] if block_type == 'fg' else []
    date = datetime.date.today().strftime('%Y%m%d')
    utc = datetime.datetime.utcnow()

    for b in df.iterrows():
        try:
            if b == None:
                continue

            block = {
                'code': b[1]['code'],
                'name': b[1]['blockname'],
                'stockCount': b[1]['stock_count'],
                'codeList': b[1]['code_list'].split(','),
                'from': 'tdx',
                'type': block_type,
                'date': date,
            }
            block_in_db = db['block'].find_one({'code': block['code']})

            if block_in_db is None:
                db['block'].insert_one(pydash.assign(
                    block, {'createdAt': utc, 'updatedAt': utc, 'tags': tags}))
                count += 1
            elif not is_part_equal(block, block_in_db):
                res = db['block'].update_one({'code': block['code']}, {
                    '$set': pydash.assign(
                        pydash.omit(block, ['date', 'type', 'alias']), {'updatedAt': utc})})
                count += res.modified_count

        except (KeyError, TypeError) as e:
            x, = e.args
            if x in ['data', 'string indices must be integers']:
                pass
            else:
                print(str(e))
                raise e

    return count


def main():
    res = {'zs': 0, 'gn': 0, 'fg': 0}
    # 删除所以from tdx的记录
    # db['block'].delete_many({'from': 'tdx'})

    try:
        # 遍历zs,gn,fg
        for block_type in ['zs', 'gn', 'fg']:
            # 读取block文件
            file = TDX_HQ_DIR + '/block_' + block_type + '.dat'
            df = BlockReader().get_df(file, BlockReader_TYPE_GROUP)

            df_with_code = df.merge(read_block_code_map(), on='blockname')
            res[block_type] = save_block(df_with_code, block_type)
    finally:
        db.client.close()
        print('[py] 更新tdx-block完成:指数-%s, 概念-%s, 风格-%s' %
              (res['zs'], res['gn'], res['fg']))


# df = CustomerBlockReader().get_df(
#     'C:\\Program Files\\TDX_PRO7.602\\T0002\\blocknew', BlockReader_TYPE_GROUP)
# print(df)

if __name__ == '__main__':
    main()
