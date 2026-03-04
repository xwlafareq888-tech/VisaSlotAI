from typing import List
from app.scanner.scanner import fetch_page
from app.parser.slot_parser import detect_slots
import asyncio


async def scan_single(url: str):

    html = await fetch_page(url)

    slots = detect_slots(html)

    return {
        "url": url,
        "slots": slots
    }


async def scan_multiple(urls: List[str]):

    tasks = []

    for url in urls:
        tasks.append(scan_single(url))

    results = await asyncio.gather(*tasks)

    return results