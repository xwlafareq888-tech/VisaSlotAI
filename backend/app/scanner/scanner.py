from playwright.async_api import async_playwright
from playwright_stealth import stealth_async
from app.network.proxy_pool import get_proxy
from app.services.telegram_service import send_telegram_alert


async def fetch_page(url: str) -> str:
    """
    URL'i Playwright ile açar ve HTML içeriğini döndürür
    """

    proxy = get_proxy()

    try:

        async with async_playwright() as p:

            launch_args = {
                "headless": True,
                "args": [
                    "--disable-blink-features=AutomationControlled",
                    "--no-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu",
                    "--window-size=1920,1080"
                ]
            }

            # Proxy ekle
            if proxy:
                launch_args["proxy"] = {"server": proxy}

            browser = await p.chromium.launch(**launch_args)

            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                viewport={"width": 1920, "height": 1080},
                locale="en-US",
                timezone_id="Europe/Berlin",
                java_script_enabled=True,
                bypass_csp=True # İçerik güvenlik politikalarını bypass et
            )

            page = await context.new_page()
            
            # Anti-Bot (Stealth) korumasını aktif et - sitelerin bot olduğumuzu anlamasını zorlaştırır
            await stealth_async(page)

            # Extra navigasyon önlemleri
            await page.set_extra_http_headers({
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Sec-Ch-Ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": "\"Windows\"",
                "Upgrade-Insecure-Requests": "1"
            })

            await page.goto(
                url,
                timeout=60000,
                wait_until="domcontentloaded"
            )

            # ekstra bekleme (JS yüklenmesi için)
            await page.wait_for_timeout(2000)

            html = await page.content()

            await context.close()
            await browser.close()

            return html

    except Exception as e:

        error_message = f"""
❌ FETCH ERROR

URL: {url}

Error:
{str(e)}
"""

        print(error_message)

        # Telegram hata bildirimi
        try:
            send_telegram_alert(error_message)
        except:
            pass

        return ""