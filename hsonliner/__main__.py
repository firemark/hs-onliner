from sys import argv
from hsonliner.config import get_config
from hsonliner.db import create_database, get_engine, get_session


if __name__ == "__main__":
    cfg = get_config()
    cmd = argv[1] if len(argv) >= 2 else 'run-debug'

    engine = get_engine(cfg['sql_uri'])
    Session = get_session(engine)

    if cmd == 'run-debug':
        from hsonliner.app import app
        app.config.update(ENGINE=engine, SESSION=Session, SALT=cfg['salt'])
        app.run(debug=True)
    elif cmd == 'code':
        from code import interact
        from hsonliner.models import User, Event, Participant, Token

        interact(local=globals())
    elif cmd == 'create-database':
        create_database(engine)
    elif cmd == 'create-user':
        from hsonliner.models import User
        with Session.scope() as session:
            user = User(name=argv[2], email=argv[3])
            user.generate_password(argv[4], salt=cfg['salt'])
            session.add(user)
