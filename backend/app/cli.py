import uvicorn
import subprocess
import sys
import os

def start_api():
    """VisaSlotAI API sunucusunu baslatir"""
    print("🚀 VisaSlotAI API baslatiliyor...")
    
    # Doğru ana dizini bulmak için absolute path kullanıyoruz
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(backend_dir)
    sys.path.insert(0, backend_dir)
    
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)

def start_worker():
    """Celery Worker baslatir"""
    print("👷 VisaSlotAI Worker baslatiliyor...")
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    subprocess.run([sys.executable, "-m", "celery", "-A", "app.workers.celery_app", "worker", "--loglevel=info", "--pool=solo"], cwd=backend_dir)

def start_beat():
    """Celery Beat baslatir"""
    print("⏱️ VisaSlotAI Task Scheduler (Beat) baslatiliyor...")
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    subprocess.run([sys.executable, "-m", "celery", "-A", "app.workers.celery_app", "beat", "--loglevel=info"], cwd=backend_dir)

