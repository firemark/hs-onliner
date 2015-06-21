from CodernityDB.database import Database
from CodernityDB.tree_index import TreeBasedIndex
from time import mktime
from datetime import date


def get_db(pathname):
    db = Database(pathname)
    if db.exists():
        db.open()
        return db

    db.create()
    ind = DateIndex(db.path, 'days')
    db.add_index(ind)

    return db


class DateIndex(TreeBasedIndex):
    custom_header = (
        'from CodernityDB.tree_index import TreeBasedIndex\n'
        'from datetime import date\n'
        'from time import mktime'
    )

    def __init__(self, *args, **kwargs):
        kwargs['node_capacity'] = 10
        kwargs['key_format'] = 'I'
        super(DateIndex, self).__init__(*args, **kwargs)

    def make_key_value(self, data):
        timestamp = data.get('timestamp')
        if timestamp is not None:
            return int(timestamp), None

        date = data.pop('date', None)
        if date is None:
            return None

        timestamp = data['timestamp'] = mktime(date.timetuple())
        return int(timestamp), None

    def make_key(self, key):
        if isinstance(key, date):
            return mktime(key.timetuple())
        return key
