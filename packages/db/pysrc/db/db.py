# -*- coding: UTF-8 -*-
from logging import root
import os
from pymongo import MongoClient


def _connect_mongo(host, port, username, password, dbname):
    """ A util for making a connection to mongo. """
    if username and password:
        mongo_uri = "mongodb://%s:%s@%s:%s/%s" % (
            username, password, host, port, dbname)
        conn = MongoClient(mongo_uri)
    else:
        conn = MongoClient(host, port)

    return conn[dbname]


db_ip = os.getenv('AWST_DBIP', 'localhost')
db_port = os.getenv('AWST_DBPORT', 27017)
db_user = os.getenv('AWST_DBUSER', 'root')
db_passwd = os.getenv('AWST_DBPASSWD', '123456')
# client = MongoClient('mongodb://%1:%2/'.format(db_ip, db_port))
db = _connect_mongo(db_ip, db_port, username=db_user,
                    password=db_passwd, dbname='awamstock')
