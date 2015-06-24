from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from hsonliner.models import Base


def get_engine(uri):
    return create_engine(uri)


def get_session(engine):
    return sessionmaker(bind=engine)


def create_database(engine):
    Base.metadata.create_all(engine)
