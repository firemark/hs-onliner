from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from hsonliner.models import Base


def get_session(uri):
    return sessionmaker(bind=create_engine(uri))


def create_database(session, engine):
    Base.metadata.create_all(engine)
