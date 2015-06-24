from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from hsonliner.models import Base
from contextlib import contextmanager


def get_engine(uri):
    return create_engine(uri)


def get_session(engine):
    Session = sessionmaker(bind=engine)
    Session.scope = lambda: session_scope(Session)
    return Session


def create_database(engine):
    Base.metadata.create_all(engine)


@contextmanager
def session_scope(cls):
    """from http://docs.sqlalchemy.org/en/rel_1_0/orm/session_basics.html"""
    session = cls()
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()