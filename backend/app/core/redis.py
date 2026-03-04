import os
import redis

# Redis URL al (Docker için geçersiz kılınabilir)
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6380/0")

redis_client = redis.from_url(
    REDIS_URL,
    decode_responses=True
)