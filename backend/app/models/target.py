from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.models.scan_log import Base
from datetime import datetime

class Target(Base):
    __tablename__ = "targets"

    id = Column(Integer, primary_key=True, index=True)
    provider = Column(String, default="unknown")
    country = Column(String, index=True)
    location = Column(String)
    url = Column(String)
    is_active = Column(Boolean, default=True) # Sadece aktif hedefleri tara
    created_at = Column(DateTime, default=datetime.utcnow)
