import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Render provides postgres://, SQLAlchemy needs postgresql://
# We also use pg8000
raw_db_url = os.getenv("DATABASE_URL", "postgresql://visaslot:visaslot@localhost:5432/visaslot")

if raw_db_url and raw_db_url.startswith("postgres://"):
    raw_db_url = raw_db_url.replace("postgres://", "postgresql://", 1)

if raw_db_url and raw_db_url.startswith("postgresql://"):
    DATABASE_URL = raw_db_url.replace("postgresql://", "postgresql+pg8000://", 1)
else:
    DATABASE_URL = raw_db_url

# Initialize engine
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
