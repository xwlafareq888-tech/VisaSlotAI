from celery import Celery

celery = Celery(
    "visaslot",
    broker="redis://localhost:6380/0",
    backend="redis://localhost:6380/0"
)

# Celery ayarları
celery.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True
)

# worker klasöründeki taskları otomatik bul
celery.autodiscover_tasks(["app.workers"])

# Beat schedule
celery.conf.beat_schedule = {
    "auto-scan-every-30-seconds": {
        "task": "scan_all_targets",
        "schedule": 30.0,
        "args": ()
    }
}

import app.workers.tasks