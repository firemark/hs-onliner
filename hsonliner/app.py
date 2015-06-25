from hsonliner.models import User, Event, Participant, Token
from hsonliner.converters import DateConverter

from flask import Flask, abort, jsonify, request
from datetime import datetime, timedelta
from functools import wraps

app = Flask(__name__)
app.url_map.converters['date'] = DateConverter


def session_scope():
    return app.config['SESSION']().scope()


app.session = lambda: app.config['SESSION'].scope()

WILL_BE_STATES = ('yes', 'probably', 'maybe')


def login_required(func):

    @wraps(func)
    def inner(**kwargs):
        token_hash = request.headers.get('token')

        if token_hash is None:
            return 'token not found', 403

        with session_scope() as session:
            token = session.query(Token).filter_by(hash=token_hash)
            user = session.query(User).filter_by(id=token.user)
            token.expire_date += timedelta(minutes=10)

        return func(user, **kwargs)

    return inner


@app.route("/login/<string:name>", methods=['POST'])
def login(name):
    pswd = User.generate_hash(request.data, app.config['SALT'])
    with session_scope() as session:
        user_id = (session.query(User.id)
                   .filter_by(name=name, pswd=pswd).scalar())

    if user_id is None:
        return 'user', 403

    token = Token(
        user_id=user_id,
        expire_data=datetime.now() + timedelta(minutes=10)
    )

    with session_scope() as session:
        session.add(token)

    return jsonify({'token': token.hash})


@app.route("/<date:date>", methods=['GET'])
def get_day(date):
    try:
        record = db.get('days', date)
    except RecordNotFound:
        return 'day', 404
    return jsonify(record)


@login_required
@app.route("/<date:date>", methods=['PUT', 'POST'])
def update_day(user, date):
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


@login_required
@app.route("/<date:date>/user/<string:name>", methods=['GET'])
def get_user(date, name):
    try:
        record = db.get('days', date)
    except RecordNotFound:
        return 'day', 404
    if name not in record['users']:
        return 'user', 404

    return jsonify(record)


@login_required
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


@login_required
@app.route("/<date:past>/<date:pre>", methods=['GET'])
def range_view(past, pre):
    return jsonify(db.get_many('days', past=past, end=pre))

