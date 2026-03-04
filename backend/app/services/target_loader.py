from app.core.database import SessionLocal
from app.models.target import Target


def load_targets():
    """
    Veritabanındaki sadece 'aktif' (is_active=True) olan hedefleri çeker.
    """
    db = SessionLocal()
    targets = []
    
    try:
        active_targets = db.query(Target).filter(Target.is_active == True).all()
        for t in active_targets:
            targets.append({
                "id": t.id,
                "provider": t.provider,
                "country": t.country,
                "location": t.location,
                "url": t.url
            })
    except Exception as e:
        print(f"Target load error: {e}")
    finally:
        db.close()

    return targets