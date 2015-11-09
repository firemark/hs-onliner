from hsonliner.models import User, Event, Participant, Token
from hsonliner.converters import DateConverter, TimeConverter

from flask import Flask, jsonify, request, Response
from datetime import datetime, timedelta
from functools import wraps

from sqlalchemy import func

app = Flask(__name__)
app.url_map.converters['date'] = DateConverter


def session_scope():
    return app.config['SESSION'].scope()


def update_with_attrs(query, obj, converter=None, attrs=None):
    attrs = attrs or []
    for attr in attrs:
        value = query.get(attr)
        if value is None:
            continue
        if converter is not None:
            value = converter.to_python(value)
        setattr(obj, attr, value)


def authenticate():
    """
        Sends a 401 response that enables basic auth
        from http://flask.pocoo.org/snippets/8/
    """

    return Response(
        response=(
            'Could not verify your access level for that URL.\n'
            'You have to login with proper credentials',
        ),
        status=401,
        headers={'WWW-Authenticate': 'Basic realm="Token Required"'}
    )


def login_required(func):

    @wraps(func)
    def inner(*args, **kwargs):
        auth = request.authorization
        if not auth:
            return authenticate()

        token_hash = auth.password
        user_id = auth.username

        with session_scope() as session:
            token = (
                session.query(Token)
                .filter(Token.hash==token_hash)
                .filter(Token.user_id==user_id)
                .scalar()
            )
            if token is None:
                return authenticate()
            user = session.query(User).get(token.user_id)
            if user is None:
                return authenticate()
            token.expire_date += timedelta(minutes=10)
            session.add(token)

        return func(user, *args, **kwargs)

    return inner


@app.route("/login/<string:name>", methods=['PATCH'])
def login(name):
    raw_pwsd = request.json['password']
    pswd = User.generate_hash(raw_pwsd, app.config['SALT'])
    with session_scope() as session:
        user_id = (session.query(User.id)
                   .filter_by(name=name, pswd=pswd).scalar())

    if user_id is None:
        return 'user not found', 404

    token = Token(
        user_id=user_id,
        expire_date=datetime.now() + timedelta(minutes=10)
    )

    token.generate_hash(name)

    with session_scope() as session:
        session.add(token)

    return jsonify({'id': user_id, 'token': token.hash})


@app.route("/<date:date>", methods=['GET'])
def get_event(date):
    with session_scope() as session:
        event = session.query(Event).filter_by(date=date).scalar()
    if event is None:
        return 'event not found', 404
    return jsonify(event.to_dict())


@app.route("/<date:date>", methods=['PUT', 'POST'])
@login_required
def update_event(user, date):
    with session_scope() as session:
        event = session.query(Event).filter_by(date=date).scalar()
    if event is None:
        if request.method == 'PUT':
            return 'event not found', 404
        event = Event(date=date)

    query = request.json
    update_with_attrs(query, event, attrs=['topic', 'description'])
    update_with_attrs(
        query, event,
        converter=TimeConverter,
        attrs=['time_start', 'time_end']
    )

    with session_scope() as session:
        session.add(event)
    return jsonify(event.to_dict())


@app.route("/<date:date>", methods=['DELETE'])
@login_required
def delete_event(user, date):
    with session_scope() as session:
        count = session.query(Event).filter_by(date=date).delete()
    if count == 0:
        return 'event not found', 404


@app.route("/", methods=['GET'])
def get_events():
    args = request.args
    from_date = DateConverter.get(args.get('from'))
    to_date = DateConverter.get(args.get('to'))

    with session_scope() as session:
        events = session.query(Event).order_by(Event.date.desc())
        if from_date is not None:
            events = events.filter(Event.date >= from_date)
        if to_date is not None:
            events = events.filter(Event.date <= to_date)
        events = events.limit(30)
    return jsonify({
        'results': [event.to_dict() for event in events]
    })


@app.route("/<date:date>/participant/", methods=['GET'])
def get_participants(date):
    with session_scope() as session:
        participants = (
            session.query(Participant)
            .join(Participant.event)
            .filter(Event.date == date)
        )
    return jsonify({
        'results': [participant.to_dict() for participant in participants]
    })


@app.route("/<date:date>/participant/<string:name>", methods=['GET'])
def get_participant(date, name):
    with session_scope() as session:
        participant = (
            session.query(Participant)
            .join(Participant.event)
            .filter(Event.date == date, Participant.name == name)
            .scalar()
        )
    if participant is None:
        return 'participant not found', 404
    return jsonify(participant.to_dict())

@app.route("/<date:date>/participant/<string:name>", methods=['DELETE'])
@login_required
def delete_participant(user, date, name):
    with session_scope() as session:
        participant_id = (
            session.query(Participant.id)
            .join(Participant.event)
            .filter(Event.date == date, Participant.name == name)
            .scalar()
        )
        if participant_id is None:
            return 'event not found', 404
        session.query(Participant).filter_by(id=participant_id).delete()
        return '', 200



@app.route("/<date:date>/participant/<string:name>", methods=['PUT', 'POST'])
@login_required
def update_participant(user, date, name):
    with session_scope() as session:
        participant = (
            session.query(Participant)
            .join(Participant.event)
            .filter(Event.date == date, Participant.name == name)
            .scalar()
        )
        if participant is None:
            if request.method == 'PUT':
                return 'participant not found', 404
            event_id = session.query(Event.id).filter_by(date=date).scalar()
            if event_id is None:
                return 'event not found', 404
            participant = Participant(
                name=name,
                event_id=event_id,
                user_id=user.id
            )

        #if participant.user_id != user.id:
        #    return 'is not your participant, bastard!', 403

    query = request.json
    try:
        participant.will_be = Participant.REV_WILL_BE_STATES[query['will_be']]
    except KeyError:
        return 'will_be value is not correct', 400

    with session_scope() as session:
        session.add(participant)
    return jsonify(participant.to_dict())
