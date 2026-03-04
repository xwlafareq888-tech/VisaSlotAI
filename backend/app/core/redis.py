import redis

redis_client = redis.Redis(
    host='localhost',
    port=6380,
    decode_responses=True
)