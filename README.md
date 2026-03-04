<div align="center">

# � <span style="color:#00e5ff">VisaSlotAI</span> 🌟
## 🚀 Next-Generation Autonomous Visa Appointment Scraper & Intelligence Dashboard

> **Bypass WAFs, Track Slots in Real-Time, and Never Miss an Appointment Again.**  
> *Built for Speed, Stealth, and Scale.*

<br>

<div style="display: flex; gap: 5px; flex-wrap: wrap; justify-content: center;">
  <img src="https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=blue" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Celery-37814A?style=for-the-badge&logo=celery&logoColor=white" alt="Celery" />
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</div>

</div>

**VisaSlotAI** is a robust, distributed, and high-performance automated system designed to continuously monitor, parse, and alert on visa appointment slot openings. Built with an anti-bot bypass engine and a unified full-stack architecture, it includes a modern "Neon Cyber" dashboard for real-time monitoring.

---

## ✨ Key Features

*   **🛡️ Anti-Bot Scraping Engine**: Utilizes Playwright with Stealth plugins to bypass Cloudflare, Datadome, and other strict WAFs.
*   **⚡ Distributed Task Processing**: Powered by Celery and Redis to handle concurrent scraping targets efficiently without blocking the main event loop.
*   **📦 Unified Pip Package**: The entire system operates as a globally installable CLI tool (`visa-api`, `visa-worker`, `visa-beat`).
*   **🎛️ Neon Cyber Dashboard**: A React-built, internally served Single Page Application (SPA) offering beautiful widgets, real-time analytics, and manual scan triggers.
*   **🌍 Timezone-Aware Logging**: Accurate DB event creation locked to `Europe/Istanbul` (or customizable) regardless of server location.
*   **🔔 Notification Ready**: Built-in architecture designed to be extensible for Telegram, Email, and SMS alerts.

---

## 🏗️ Architecture & Tech Stack

The project operates under a seamless Monolith-like execution but maintains Microservice-like separation of concerns internally.

### Backend (`/backend`)
*   **Core API**: FastAPI (High-performance async Python web framework).
*   **Task Queue**: Celery (Workers and Beat scheduler).
*   **Message Broker**: Redis.
*   **Database**: PostgreSQL (Accessed via `pg8000` & `SQLAlchemy` ORM).
*   **Browser Automation**: `playwright` + `playwright-stealth`.

### Frontend (`/frontend`)
*   **Framework**: React (TypeScript).
*   **Styling**: Tailwind CSS v4.
*   **Icons**: Lucide-React.
*   **Integration**: Compiled as static files (`npm run build`) and injected directly into FastAPI's `StaticFiles` router. No separate Node.js server required in production!

---

## 📈 Dashboard & Widgets

The built-in Cyber Dashboard (accessible at `http://localhost:8000` when the API is running) features dynamic widgets:

1.  **System Statistics Widget**: Real-time display of Total Scans, Active Targets, and System Errors (Bot blocked metrics).
2.  **Targets Manager**: View currently configured visa endpoints (Country, Visa Type, Target URL).
3.  **Live Log Viewer**: Scrollable, real-time fetching of PostgreSQL scan logs detailing exactly when slots are found, with timezone-accurate timestamps.
4.  **Manual Trigger Control**: "Scan Now" buttons to forcefully dispatch Celery worker tasks via the API bypassing the Cron schedule.

---

## � Comprehensive Budget & Infrastructure Analysis

VisaSlotAI is engineered for **Extreme Cost Efficiency**, designed to bypass the exorbitant fees of traditional Scraping-as-a-Service platforms. By leveraging scalable open-source tools and containerization, your operational costs drop to near-zero.

### 🆚 SaaS vs. Self-Hosted Cost Comparison (Monthly)

| ⚙️ Service Component | 🛑 Traditional SaaS APIs | ✅ VisaSlotAI (Self-Hosted) | 🌟 Free-Tier Alternative |
| :--- | :--- | :--- | :--- |
| **Web Scraping / Anti-Bot** | `🔴 $50 - $200+` | `🟢 $0.00` *(Local Playwright)* | Playwright Local |
| **Database (PostgreSQL)** | `🔴 $15 - $50` | `🟢 $0.00` *(Docker Local)* | Supabase/Neon (Free Tier) |
| **Task Queue (Redis)** | `🔴 $10 - $30` | `🟢 $0.00` *(Docker Local)* | Upstash (Free Tier) |
| **Hosting (Compute)** | `🔴 $20+` | `🟢 $4.00 - $7.00` *(VPS)*| Render/Fly.io (Limited) |
| **Proxies (Optional)** | `🔴 $20 - $100` | `🟢 $2.00 - $5.00` *(Custom)* | Free/Shared Proxies |
| **Notifications** | `🔴 $10+` | `🟢 $0.00` *(Telegram/SMTP)* | Telegram Bots |
| **🏆 TOTAL ESTIMATED** | `🟥 $125 - $400+ / mo` | `🟩 $4.00 - $12.00 / mo` | `🟩 $0.00 / mo` |

<br>

### 🏗️ Recommended Deployment Architectures

> [!TIP]
> #### 🌱 1. The "Zero-Cost" Hobbyist (Local Machine)
> * 💻 **Hardware**: Your personal computer (Windows/Mac/Linux).
> * 🛠️ **Setup**: Run `visa-api`, `visa-worker`, and `visa-beat` via terminal. PostgreSQL and Redis via Local Docker.
> * 💸 **Cost**: **`$0.00`**
> * 🎯 **Best for**: Part-time monitoring while you work.

> [!NOTE]
> #### 🚀 2. The "Budget Cloud" (High Availability)
> * ☁️ **Provider**: Hetzner (CX11 - €3.79/mo) or DigitalOcean ($4/mo Basic Droplet).
> * ⚙️ **Specs**: 1 vCPU, 2GB RAM (Minimum required for Headless Chromium).
> * 🛠️ **Setup**: Ubuntu 22.04 LTS, Docker Compose for DB/Redis, Systemd or PM2 for CLI.
> * 💸 **Cost**: **`~$4.00 / month`**
> * 🎯 **Best for**: 24/7 continuous monitoring of 5-10 visa targets.

> [!IMPORTANT]
> #### 🏢 3. The "Distributed Enterprise" (Massive Scale)
> * 🌐 **Provider**: AWS, GCP, or Azure.
> * ⚙️ **Specs**: Dedicated API Server (ECS/EC2), Managed DBs, Dedicated Redis, Auto-scaling Celery Workers.
> * 🛡️ **Proxy Pool**: Rotating Residential IP Proxies.
> * 💸 **Cost**: **`$50.00+ / month`**
> * 🎯 **Best for**: Tracking hundreds of targets across dozens of countries concurrently.

---

## 🔌 Integrations & Extensibility

VisaSlotAI is built with a decoupled architecture, allowing you to easily snap-in additional modules:

* **Telegram Alerts**: Create a free Telegram Bot via BotFather. Inject your `TELEGRAM_BOT_TOKEN` and `CHAT_ID` into `.env` to receive instant messages the millisecond a slot opens.
* **Email Notifications**: Standard Python `smtplib` can be configured to use Gmail App Passwords for free email alerts.
* **Discord Webhooks**: Easily push JSON payloads to a Discord channel.
* **Custom Proxy Rotation**: Connect the Playwright engine to proxy services like Smartproxy or IPRoyal by simply updating the proxy arguments in the base scraper class.

## 🛡️ Security & Anti-Detect Mechanics

Modern visa appointment websites (like VFS Global, BLS, iDATA) employ strict Cloudflare and Datadome protections. VisaSlotAI counters this with:
1. **Playwright Stealth**: Injects specific scripts to mask headless browser signatures (e.g., overriding `navigator.webdriver`).
2. **Humanized Interactions**: Randomized delays, bezier-curve mouse movements, and natural scrolling patterns.
3. **Session Re-use**: Carefully manages cookies and local storage to avoid triggering "new device" security flags on consecutive runs.
4. **Rate Limit Evasion**: Configurable Celery Beat intervals ensure the system doesn't spam endpoints, blending in with standard human traffic.

---

## 🚀 Installation & Setup

### 1. Prerequisites
*   Python 3.10 or higher
*   Node.js v18+ (for frontend compilation if making UI changes)
*   Docker & Docker Compose (for PostgreSQL and Redis)

### 2. Infrastructure Setup (Database & Redis)
Navigate to the root directory and start the Docker containers:
```bash
cd docker
docker-compose up -d
```

### 3. Application Installation
Install the project as an editable pip package. This will expose the custom CLI commands globally in your environment.
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -e .
playwright install  # Download the headless browser binaries
```

### 4. Compiling the Frontend (Optional - if making UI changes)
```bash
cd frontend
npm install
npm run build
# The build output is automatically configured to be read by the backend
```

---

## 💻 Usage & CLI Commands

Because VisaSlotAI is packaged via `setup.py`, you can manage the entire ecosystem directly from your terminal using simple commands.
*Make sure your virtual environment is activated.*

### Start the API & Dashboard
Boots the FastAPI server on port 8000 and serves the React Cyber Dashboard.
```bash
visa-api
```
👉 *Visit http://localhost:8000 in your browser.*

### Start the Scraping Worker
Initializes the Celery worker that executes the Playwright stealth scripts in the background.
```bash
visa-worker
```

### Start the Scheduler (Cron)
Initializes Celery Beat, which automatically pushes scan tasks to the worker based on your defined intervals.
```bash
visa-beat
```

---

## ⚙️ Configuration

Targets are managed via a JSON configuration file located at: `backend/app/config/scan_targets.json`

Example structure:
```json
[
  {
    "id": "trk_schengen_01",
    "country": "Germany",
    "visa_type": "Schengen - Tourist",
    "url": "https://example-visa-provider.com/appointments",
    "check_interval_minutes": 15
  }
]
```

## ⚠️ Legal & Ethical Disclaimer
This software is provided for educational and personal use only. Automated accessing of appointment booking systems may violate the Terms of Service of specific providers (e.g., VFS Global, iDATA, TLScontact). The developers assume no liability for IP bans, account suspensions, or legal repercussions resulting from the use of this software. Please configure reasonable `check_interval_minutes` to avoid overloading targeted servers.

---
*Built with ❤️ by AI.*