from hsonliner.converters import DateConverter, TimeConverter

from sqlalchemy import (
    Column, Integer, String, ForeignKey, DateTime, Date, Time, Text, func,
    ForeignKeyConstraint)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from hashlib import sha1
from datetime import datetime


Base = declarative_base()

def cascade_foreign_key(key):
    return ForeignKey(key, onupdate="CASCADE", ondelete="CASCADE")


class Model(Base):
    __abstract__ = True
    id = Column(Integer, primary_key=True)
    time_add = Column(DateTime, default=func.now())
    time_update = Column(DateTime, default=func.now(), onupdate=func.now())


class User(Model):
    __tablename__ = 'users'
    name = Column(String(100), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=True)
    pswd = Column(String(64), nullable=False)

    participants = relationship('Participant', backref='user')

    @staticmethod
    def generate_hash(pswd, salt=''):
        return sha1(salt + pswd).hexdigest()

    def generate_password(self, pswd, salt=''):
        self.pswd = self.generate_hash(pswd, salt)


class Event(Model):
    __tablename__ = 'events'
    topic = Column(String(100))
    description = Column(Text)
    date = Column(Date, index=True)
    time_start = Column(Time)
    time_end = Column(Time)

    participants = relationship('Participant', backref='event')

    def to_dict(self):
        return {
            'description': self.description,
            'topic': self.topic,
            'date': DateConverter.to_url(self.date),
            'time_start': TimeConverter.to_url(self.time_start),
            'time_end': TimeConverter.to_url(self.time_end)
        }


class Participant(Model):
    __tablename__ = 'participants'
    WILL_BE_STATES = {
        'y': 'yes',
        'p': 'probably',
        'm': 'maybe',
    }
    REV_WILL_BE_STATES = {v: k for k,v in WILL_BE_STATES.items()}
    name = Column(String(100), nullable=False)
    will_be = Column(String(1), nullable=False)
    event_id = Column(Integer, cascade_foreign_key('events.id'), nullable=False)
    user_id = Column(Integer, cascade_foreign_key('users.id'), nullable=False)

    fk_participant = ForeignKeyConstraint(
        ['name', 'event_id'],
        ['participant.name', 'participant.event_id']
    )

    def to_dict(self):
        return {
            'name': self.name,
            'will_be': self.WILL_BE_STATES[self.will_be],
        }


class Token(Base):
    __tablename__ = 'tokens'
    hash = Column(String(64), nullable=False, primary_key=True)
    user_id = Column(Integer, cascade_foreign_key('users.id'), nullable=False)
    expire_date = Column(DateTime, nullable=False)

    def generate_hash(self, name):
        data = "{}_{}".format(datetime.now(), name)
        self.hash = sha1(data).hexdigest()