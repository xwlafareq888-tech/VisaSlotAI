from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.api.routes import router
from app.models.scan_log import Base
from app.models.target import Target
from app.core.database import engine
import os

# Veritabanı tablolarını ilk çalışmada oluştur
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="VisaSlot API",
    description="API for managing visa appointment slots",
    version="1.0.0",
)

# CORS (Cross-Origin Resource Sharing) Ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

# React Arayüzünü Serve Etme (Statik Dosyalar)
STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app", "static")
if os.path.exists(STATIC_DIR):
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")

@app.get("/{full_path:path}")
def catch_all(full_path: str):
    # Eğer endpoint değilse ve dosya yoksa react'a (index.html) yönlendir
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "VisaSlot AI Backend Running (Frontend not built)"}
