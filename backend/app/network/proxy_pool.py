import random
import os

# .env kullanmak için
PROXIES_ENV = os.getenv("PROXY_LIST")

# Eğer .env içinde proxy varsa kullan
if PROXIES_ENV:
    PROXIES = [p.strip() for p in PROXIES_ENV.split(",")]
else:
    PROXIES = []


def get_proxy():
    """
    Rastgele proxy döndürür.
    Proxy yoksa None döner.
    """

    if not PROXIES:
        return None

    return random.choice(PROXIES)