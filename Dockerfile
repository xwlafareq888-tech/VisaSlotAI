FROM python:3.10-slim

# Prevent Python from writing byte-compile files and buffering stdout
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH=/app/backend

# Set working directory
WORKDIR /app/backend

# Install OS dependencies for Playwright, PostgreSQL, and basic tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    gnupg \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libxshmfence1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY backend/ .

# Install the application as a normal package for entry points (visa-api, visa-worker, visa-beat)
RUN pip install -e .

# Install Playwright browsers (chromium only needed for production)
RUN playwright install chromium --with-deps

# Default fastAPI port
EXPOSE 8000

# Default command if nothing is provided (can be overridden by docker-compose)
CMD ["visa-api"]
