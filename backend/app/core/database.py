import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# docker-compose.yml içindeki ayarlara göre default değer
# psycopg2 DLL hatalarını önlemek için pg8000 driver'ına geçirildi
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+pg8000://visaslot:visaslot@localhost:5432/visaslot")

# Veritabanı motorunu oluştur
engine = create_engine(DATABASE_URL)

# Oturum (Session) fabrikası
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
