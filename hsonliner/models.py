from sqlalchemy import (
    Column, Integer, String, ForeignKey, DateTime, Date, Time, Text, func
)
from sqlalchemy.ext.declarative import declarative_base
from hashlib import sha1
from datetime import datetime

Base = declarative_base()


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

    def generate_password(self, pswd, salt=''):
        self.pswd = sha1(salt + pswd).hexdigest()


class Event(Model):
    __tablename__ = 'events'
    topic = Column(String(100))
    description = Column(Text)
    date = Column(Date, index=True)
    time_start = Column(Time)
    time_end = Column(Time)


class Participant(Model):
    __tablename__ = 'participants'
    WILL_BE_STATES = ('yes', 'probably', 'maybe')
    name = Column(String(100), unique=True, nullable=True)
    will_be = Column(String(10), nullable=False)
    event = Column(Integer, ForeignKey('events.id'), nullable=False)
    user = Column(Integer, ForeignKey('users.id'), nullable=False)


class Token(Base):
    __tablename__ = 'tokens'
    hash = Column(String(64), nullable=False, primary_key=True)
    user = Column(Integer, ForeignKey('users.id'), nullable=False)
    expire_date = Column(DateTime, nullable=False)

    def generate_hash(self, name=None):
        name = self.user.name if name is not None else name
        data = "{}_{}".format(datetime.now(), name)
        self.hash = sha1(data).hexdigest()