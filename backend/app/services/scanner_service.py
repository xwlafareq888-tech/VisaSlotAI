from app.scanner.scanner import fetch_page
from app.parser.slot_parser import detect_slots
from app.services.telegram_service import send_telegram_alert
from app.core.redis import redis_client

ALERT_COOLDOWN_SECONDS = 1800  # 30 dakika (1800 saniye)


async def scan_site(url: str, provider: str = "unknown"):
    """
    Belirtilen URL'i tarar ve randevu slotlarını analiz eder.
    """

    try:

        # Sayfayı yükle
        html = await fetch_page(url)

        if not html:
            return {
                "success": False,
                "url": url,
                "provider": provider,
                "error": "HTML fetch failed"
            }

        # Slot analizi
        slots = detect_slots(html, provider)

        result = {
            "success": True,
            "url": url,
            "provider": provider,
            "slots_found": len(slots),
            "slots": slots
        }

        print("SCAN RESULT:", result)

        # Slot bulunduysa telegram mesajı gönder
        if slots:
            # Önce Redis'i kontrol et
            cache_key = f"alert_cooldown:{url}"
            is_in_cooldown = redis_client.get(cache_key)

            if is_in_cooldown:
                print(f"Skipping Telegram alert for {url} (Cooldown active)")
            else:
                # Cooldown yoksa mesaj gönder
                message = f"""🚨 VISA SLOT FOUND 🚨

Provider: {provider.upper()}
URL: {url}
Slots Found: {len(slots)}

Slots Details:
{slots}
"""
                send_telegram_alert(message)
                
                # Uyarı gönderildikten sonra 30 dakikalık (1800 sn) engel koy
                redis_client.setex(cache_key, ALERT_COOLDOWN_SECONDS, "triggered")

        return result

    except Exception as e:

        error = {
            "success": False,
            "url": url,
            "error": str(e)
        }

        print("SCAN ERROR:", error)

        # Hata telegram bildirimi (Spam önlemi ile - Hatalar için 60 dk cooldown)
        try:
            error_cache_key = f"error_cooldown:{url}"
            is_error_in_cooldown = redis_client.get(error_cache_key)
            
            if not is_error_in_cooldown:
                send_telegram_alert(f"❌ Scan Error\n\nProvider: {provider.upper()}\nURL: {url}\n\nError: {str(e)}")
                redis_client.setex(error_cache_key, 3600, "error_triggered") # 1 saat spamlama
            else:
                print(f"Skipping error alert for {url} (Error Cooldown active)")
        except:
            pass

        return error