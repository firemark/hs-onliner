from os import environ
from ConfigParser import ConfigParser

KEYS = 'sql_uri', 'salt'


def get_config(fp=None):
    fp = fp or open(environ.get('HSONLINER_CONFIG', 'config.ini'))
    config = ConfigParser()
    config.readfp(fp)

    return {key: config.get('cfg', key) for key in KEYS}
