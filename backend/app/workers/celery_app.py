import os
from celery import Celery

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6380/0")

celery = Celery(
    "visaslot",
    broker=REDIS_URL,
    backend=REDIS_URL
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