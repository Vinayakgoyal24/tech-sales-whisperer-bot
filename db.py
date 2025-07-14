from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from your_main_file import User  # adjust import

engine = create_engine("sqlite:///./users.db")
Session = sessionmaker(bind=engine)
session = Session()

users = session.query(User).all()
for u in users:
    print(u.id, u.email)
