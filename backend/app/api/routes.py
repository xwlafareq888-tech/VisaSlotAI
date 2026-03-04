from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.workers.tasks import scan_all_targets
from app.core.database import get_db
from app.models.scan_log import ScanLog
from app.models.target import Target
from app.schemas.target import TargetCreate, TargetResponse

router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "ok"}


@router.get("/scan")
def trigger_scan():

    # Tüm hedefleri tarayacak olan mevcut Celery task'ı başlat
    scan_all_targets.delay() # type: ignore

    return {
        "status": "queued",
        "message": "scan_all_targets task started"
    }


@router.get("/logs")
def get_recent_logs(limit: int = 50, db: Session = Depends(get_db)):
    """
    Geçmiş tarama kayıtlarını (logları) veritabanından çek.
    """
    logs = db.query(ScanLog).order_by(ScanLog.created_at.desc()).limit(limit).all()
    return {"logs": logs}

@router.get("/stats")
def get_system_stats(db: Session = Depends(get_db)):
    """
    Dashboard için sistem istatistiklerini getirir.
    """
    total_targets = db.query(Target).count()
    active_targets = db.query(Target).filter(Target.is_active == True).count()
    total_logs = db.query(ScanLog).count()
    slots_found = db.query(ScanLog).filter(ScanLog.slots_found > 0).count()
    errors_logged = db.query(ScanLog).filter(ScanLog.success == False).count()

    return {
        "total_targets": total_targets,
        "active_targets": active_targets,
        "total_scans": total_logs,
        "successful_slots": slots_found,
        "errors_logged": errors_logged
    }

# --- TARGET (HEDEF) YÖNETİMİ ---

@router.get("/targets", response_model=List[TargetResponse])
def get_all_targets(db: Session = Depends(get_db)):
    """
    Sistemdeki tüm hedefleri listeler.
    """
    return db.query(Target).all()

@router.post("/targets", response_model=TargetResponse)
def create_target(target: TargetCreate, db: Session = Depends(get_db)):
    """
    Yeni bir tarama hedefi ekler.
    """
    new_target = Target(**target.dict())
    db.add(new_target)
    db.commit()
    db.refresh(new_target)
    return new_target

@router.delete("/targets/{target_id}")
def delete_target(target_id: int, db: Session = Depends(get_db)):
    """
    Mevcut bir hedefi siler.
    """
    target = db.query(Target).filter(Target.id == target_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
    
    db.delete(target)
    db.commit()
    return {"message": f"Target {target_id} deleted."}

@router.put("/targets/{target_id}/toggle")
def toggle_target(target_id: int, db: Session = Depends(get_db)):
    """
    Bir hedefin aktiflik/pasiflik durumunu tersine çevirir (Aç-Kapa).
    """
    target = db.query(Target).filter(Target.id == target_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
    
    target.is_active = not target.is_active
    db.commit()
    return {"message": "Target status updated", "is_active": target.is_active}

