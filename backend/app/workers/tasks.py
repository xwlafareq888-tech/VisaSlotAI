import asyncio

from app.workers.celery_app import celery
from app.services.scanner_service import scan_site
from app.services.target_loader import load_targets


@celery.task(name="scan_all_targets")
def scan_all_targets():
    """
    Tüm hedef ülkeleri ve lokasyonları tarar
    """

    targets = load_targets()

    results = []

    for target in targets:

        url = target["url"]
        provider = target.get("provider", "unknown")

        try:

            result = asyncio.run(scan_site(url, provider))

            result["country"] = target["country"]
            result["location"] = target["location"]

            print("SCAN RESULT:", result)
            
            # Sonucu veritabanına kaydet (Log)
            from app.core.database import SessionLocal
            from app.models.scan_log import ScanLog
            
            db = SessionLocal()
            try:
                log = ScanLog(
                    provider=provider,
                    country=target["country"],
                    location=target["location"],
                    url=url,
                    success=result["success"],
                    slots_found=result.get("slots_found", 0),
                    slots_data=result.get("slots", []),
                    error_message=result.get("error", None)
                )
                db.add(log)
                db.commit()
            except Exception as db_err:
                print(f"Database Save Error: {db_err}")
            finally:
                db.close()

            results.append(result)

        except Exception as e:

            error = {
                "success": False,
                "country": target["country"],
                "location": target["location"],
                "url": url,
                "error": str(e)
            }

            print("SCAN ERROR:", error)
            
            # Hatayı veritabanına kaydet (Log)
            db = SessionLocal()
            try:
                log = ScanLog(
                    provider=provider,
                    country=target["country"],
                    location=target["location"],
                    url=url,
                    success=False,
                    slots_found=0,
                    error_message=str(e)
                )
                db.add(log)
                db.commit()
            except Exception as db_err:
                pass
            finally:
                db.close()

            results.append(error)

    return results