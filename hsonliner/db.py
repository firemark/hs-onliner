from CodernityDB.database import Database
from CodernityDB.tree_index import TreeBasedIndex
import time


def get_db(pathname):
    db = Database(pathname)
    db.create()
    ind = DateIndex(db.path, 'timestamp')
    db.add_index(ind)

    return db


class DateIndex(TreeBasedIndex):

    def __init__(self, *args, **kwargs):
        kwargs['key_format'] = 'I'
        super(DateIndex, self).__init__(*args, **kwargs)

    def make_key_value(self, data):
        timestamp = data.get('timestamp')
        if timestamp is not None:
            return int(timestamp), None

        date = data.pop('date', None)
        if date is None:
            return None

        timestamp = data['timestamp'] = time.timegm(date.timetuple())
        return int(timestamp), None

    def make_key(self, key):
        return key
