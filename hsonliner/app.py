from CodernityDB.database import RecordNotFound
from flask import Flask, abort, jsonify, request
from converters import DateConverter
from db import get_db

db = None
pwsd = None

app = Flask(__name__)
app.url_map.converters['date'] = DateConverter

WILL_BE_STATES = ('yes', 'probably', 'maybe')


@app.route("/<date:date>", methods=['GET'])
def get_day(date):
    print date
    try:
        record = db.get('days', date)
    except RecordNotFound:
        return 'day', 404
    return jsonify(record)


@app.route("/<date:date>", methods=['PUT', 'POST'])
def update_day(date):
    if request.headers['password-key'] != pwsd:
        return 'wrong password', 403
    try:
        record = db.get('days', date, with_doc=True)
    except RecordNotFound:
        record = None
    query = request.json
    data = {k: v for k, v in query.items() if v and k in ('name', 'desc')}

    if record is None:
        if request.method == 'PUT':
            return 'day', 404
        data.update({
            'date': date,
            'users': {}
        })
        db.insert(data)
    else:
        record.update(data)
        db.update(record)
    return data, 201

@app.route("/<date:date>/user/<string:name>", methods=['GET'])
def get_user(date, name):
    try:
        record = db.get('days', date)
    except RecordNotFound:
        return 'day', 404
    if name not in record['users']:
        return 'user', 404

    return jsonify(record)


@app.route("/<date:date>/user/<string:name>", methods=['PUT', 'POST'])
def update_user(date, name):
    if request.headers['password-key'] != pwsd:
        return 'wrong password', 403
    try:
        record = db.get('days', date)
    except RecordNotFound:
        return 'day', 404

    query = request.json
    user = record['users'].get(name, {})
    if request.method == 'PUT' and not user:
        return 'user', 404

    if query.get('hour') not in xrange(1, 24 + 1):
        return 'hour is invalid', 400

    if query.get('minutes') not in xrange(1, 60 + 1):
        return 'minutes is invalid', 400

    if query.get('state') not in WILL_BE_STATES:
        return 'will_be state is invalid', 400

    db.update(record)
    return 201


@app.route("/<date:past>/<date:pre>", methods=['GET'])
def range_view(past, pre):
    return jsonify(db.get_many('days', past=past, end=pre))

if __name__ == "__main__":
    with open('pwsd') as f:
        pwsd = f.read()
    db = get_db('/tmp/firemark')
    app.run(debug=True)
