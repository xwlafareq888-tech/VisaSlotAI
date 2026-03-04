from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON
from sqlalchemy.orm import declarative_base
from datetime import datetime
import pytz

Base = declarative_base()

def get_current_time():
    # Sistem (Türkiye veya ayarlı olan) yerel saatine göre zaman üretiyoruz.
    tz = pytz.timezone('Europe/Istanbul')
    return datetime.now(tz).replace(tzinfo=None)

class ScanLog(Base):
    __tablename__ = "scan_logs"

    id = Column(Integer, primary_key=True, index=True)
    provider = Column(String, index=True)
    country = Column(String, index=True)
    location = Column(String)
    url = Column(String)
    success = Column(Boolean, default=False)
    slots_found = Column(Integer, default=0)
    slots_data = Column(JSON, nullable=True) # Bulunan metin detayları
    error_message = Column(String, nullable=True)
    created_at = Column(DateTime, default=get_current_time)
