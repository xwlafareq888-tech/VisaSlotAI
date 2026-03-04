from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime

class TargetBase(BaseModel):
    provider: str
    country: str
    location: str
    url: str # HttpUrl yerine str bırakalım, testler için kolay olur
    is_active: Optional[bool] = True

class TargetCreate(TargetBase):
    pass

class TargetResponse(TargetBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
