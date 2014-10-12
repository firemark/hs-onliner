from sqlalchemy import (
    Column, Integer, String, Boolean, Datetime, Interval, Enum
    relationship, func
)
from .db import Base

def association_table(left, right):
    return Table('%s-%s' % (left, right), Base.metadata,
        Column('%s_id' % left, Integer, ForeignKey('%s.id' % left)),
        Column('%s_id' % right, Integer, ForeignKey('%s.id' % right))
    )


class Model(Base):
    id = Column(Integer, primary_key=True)
    time_add = Column(Datetime, default=func.now())
    time_update = Column(Datetime, default=func.now())


class Participant(Model):
    __tablename__ = 'users'
    name = Column(String(100), unique=True)
    telephone = Column(String(100))
    email = Column(String(100))

    def __init__(self, name=None):
        self.name = name

    def __repr__(self):
        return 'User(%r)' % (self.name)


class Place(Model):
    __tablename__ = 'places'
    name = Column(String(200), unique=True)
    owners = relationship(
                Participant,
                secondary=association_table('places', 'participants')
            )


class ParticipantOnEvent(Base):
    __tablename__='participants2events'
    left_id = Column(Integer, ForeignKey('events.id'), primary_key=True)
    right_id = Column(Integer, ForeignKey('participants.id'), primary_key=True)
    time_will_arrive = Column(Datetime)
    probability = Column(Integer)  # in percent
    child = relationship(Participant)


class Event(Model):
    __tablename__ = 'events'
    topic = Column(String(200))
    time_start = Column(Datetime)
    period = Column(Interval)
    place = ForeignKey(Place, backref='events')
    participants = ForeignKey(ParticipantOnEvent)
