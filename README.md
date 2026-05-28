# 🛣️ RoadWatch

> AI-powered civic reporting platform for road hazards — report issues via WhatsApp, track complaints, and hold contractors accountable.

---

## 🌟 What is RoadWatch?

RoadWatch is a full-stack civic tech platform that lets citizens report road hazards (potholes, fallen trees, accidents, broken streetlights, waterlogging, roadkill) through WhatsApp. AI automatically classifies the hazard, routes the complaint to the right government authority, and tracks resolution — while a public dashboard exposes repeat offenders and budget misuse.

---

## 🚀 Features

- **WhatsApp-first reporting** — no app download needed, works on any phone
- **AI Hazard Classifier** — upload a photo, get instant classification with severity, urgency, and suggested authority
- **Auto complaint routing** — complaint automatically sent to PWD, NHAI, Municipal Corporation, Police, Forest Department, or Electricity Board based on hazard type and location
- **Live Map** — all active complaints plotted and color-coded by type and severity
- **Repeat Offender Tracker** — flags roads with 3+ complaints in 12 months, calculates contractor shame scores
- **Budget Tracker** — sanctioned vs actual spending per road with visual charts
- **Complaint Status** — citizens can track their complaint ID with a full activity log
- **Escalation system** — unresolved complaints auto-escalate after 7 and 15 days

---

## 🧠 Tech Stack

| Layer | Tech |
|---|---|
| WhatsApp Bot | WhatsApp Business Cloud API (Meta) |
| Backend | Node.js + Express |
| AI Classifier | Groq API (Llama 4 Scout Vision) |
| Database | MySQL |
| Frontend Dashboard | React + Vite |
| Maps | Leaflet + OpenStreetMap |
| Charts | Recharts |
| Routing | React Router |

---

## 📁 Project Structure
roadwatch/
├── ai/                  # Groq vision classifier + repeat offender logic
│   ├── classifier.js    # Hazard classification using Groq vision
│   ├── repeatOffender.js # Shame scores, worst roads, flagged stretches
│   └── db.js            # MySQL connection
├── server/              # Express API server
│   └── index.js         # /api/classify endpoint
├── dashboard/           # React + Vite frontend
│   └── src/
│       ├── pages/       # LiveMap, RepeatOffenders, BudgetTracker, ComplaintStatus, Classify
│       ├── components/  # Navbar
│       └── api/         # Axios API calls
├── database/
│   └── schema.sql       # Full MySQL schema
└── .env                 # API keys (not committed)
---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MySQL
- Groq API key (free at [console.groq.com](https://console.groq.com))
- Meta WhatsApp Business Cloud API credentials

### 1. Clone the repo
```bash
git clone https://github.com/palaklohia/roadwatch.git
cd roadwatch
```

### 2. Set up environment variables
Create a `.env` file in the root:
GROQ_API_KEY=your_groq_key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=complaint_routing_db
WHATSAPP_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_ID=your_phone_id
### 3. Set up the database
```bash
mysql -u root -p < database/schema.sql
```

### 4. Start the AI/API server
```bash
cd server
npm install
npm run dev
```

### 5. Start the dashboard
```bash
cd dashboard
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🗺️ Pages

| Page | Description |
|---|---|
| Live Map | All complaints plotted on a map, filterable by hazard type |
| Repeat Offenders | Worst roads and contractors ranked by complaint count and shame score |
| Budget Tracker | Sanctioned vs spent budget per road with utilization charts |
| Complaint Status | Track any complaint by ID with full activity timeline |
| Report Hazard | Upload a photo — AI classifies and routes it instantly |

---

## 🔁 How It Works

1. Citizen sends photo + location on WhatsApp
2. Backend receives webhook from Meta
3. Photo sent to Groq Vision AI → returns hazard type, severity, suggested authority
4. System geo-fences location → identifies road type → looks up responsible authority
5. Complaint auto-filed and emailed to authority
6. Citizen gets complaint ID + confirmation
7. Cron job follows up after 7 days if unresolved, escalates after 15 days
8. All data feeds the public dashboard in real time

---

## 📊 Repeat Offender Logic

- A road stretch is flagged if it receives **3+ complaints within a 500m radius in 12 months**
- Contractor **Shame Score** = total complaints ÷ number of roads managed
- Scores rated: 🟢 Good / 🟡 Average / 🟠 Poor / 🔴 Critical

---

## 🤝 Contributors

- **Palak** — AI classifier, repeat offender tracker, React dashboard
- **Sherushi** — Backend, WhatsApp integration, database, complaint routing

---

## 📄 License

MIT