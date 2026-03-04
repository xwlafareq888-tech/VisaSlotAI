from setuptools import setup, find_packages

setup(
    name="visaslotai-api",
    version="0.1.0",
    description="VisaSlotAI - Akilli Randevu Tarama Merkezi API",
    author="Gelistirici",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.100.0",
        "uvicorn>=0.22.0",
        "sqlalchemy>=2.0.0",
        "pydantic>=2.0.0",
        "celery>=5.3.0",
        "redis>=4.5.0",
        "playwright>=1.35.0",
        "playwright-stealth>=1.0.6",
        "beautifulsoup4>=4.12.0",
        "python-dotenv>=1.0.0",
        "pg8000>=1.30.0"
    ],
    entry_points={
        "console_scripts": [
            "visa-api=app.cli:start_api",
            "visa-worker=app.cli:start_worker",
            "visa-beat=app.cli:start_beat",
        ]
    },
    python_requires=">=3.8",
)
