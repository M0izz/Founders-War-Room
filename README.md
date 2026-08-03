# 🏛️ Founder's War Room AI

> **"Before the Market Judges You, We Will."**

[![Live Demo](https://img.shields.io/badge/Live_Demo-founders--war--room.vercel.app-0070F3?style=for-the-badge&logo=vercel&logoColor=white)](https://founders-war-room.vercel.app)
[![Azure AI Foundry](https://img.shields.io/badge/Azure_AI-Foundry-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)](https://ai.azure.com)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express.js-Serverless-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)

---

## 📌 Executive Overview

**Founder's War Room AI** is a multi-agent AI executive boardroom designed for entrepreneurs, product managers, and venture capitalists. Instead of simple chatbot prompts, Founder's War Room deploys **8 specialized AI C-suite executives** who concurrently analyze, cross-examine, debate, and score startup ideas across 6 core business dimensions.

The system features real-time **Server-Sent Events (SSE) streaming**, a **V1 → V2 startup versioning engine**, multi-tenant **Firebase Auth & Cloud Firestore isolation**, and comprehensive **Executive Reports** complete with score breakdown graphs and PDF export.

---

## ⚡ Key Features

- 👔 **8 Specialized AI Executive Board Members**: Parallel execution from CEO, CTO, Investor, CMO, Customer, Competitor, Risk Advisor, and Grim Reaper.
- ⚔️ **Cross-Examination & Dispute Engine**: Automatically detects contradictory assumptions between board members (e.g., Investor valuation vs. Customer willingness to pay) and forces targeted agent rebuttals.
- 🚀 **V1 → V2 Startup Versioning System**: Create new iterations of an existing startup without re-entering details. Form auto-fills previous version data while tracking score deltas over time.
- 📊 **Interactive Evolution Timeline**: Visual SVG score graph tracking startup improvements across versions, focus areas, and addressed board recommendations.
- 🔒 **Multi-Tenant User Isolation**: Per-user Firebase Auth (Email/Password & Google OAuth) with Firestore security rules (`userId` scoping) ensuring 100% data privacy across accounts.
- 📝 **Executive Memo & PDF Export**: Detailed report breakdown with SWOT, action items, board member quotes, and 1-click PDF download via `html2pdf.js`.
- 🦈 **Shark Tank Mode Toggle**: Optional high-friction mode that transforms the board from collaborative advisors to aggressive, adversarial venture capitalists.
- 🌐 **Multi-Language Support (i18n)**: Instant language switching across English, Spanish, French, German, Japanese, and Arabic.

---

## 🧠 Multi-Agent Architecture & Pipeline

```
                       ┌─────────────────────────┐
                       │  User Idea Submission   │
                       └────────────┬────────────┘
                                    │
                       ┌────────────▼────────────┐
                       │   Backend Orchestrator  │
                       │    (Express + Azure)    │
                       └────────────┬────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌──────────────────────┐                         ┌──────────────────────┐
│ Core Domain Agents   │                         │  💀 Grim Reaper      │
│ (Parallel Execution) │                         │ (Sequential Autopsy) │
│ CEO · CTO · Investor │                         │ Analyzes all 7 agent │
│ CMO · Customer · Risk│                         │ findings for failure │
└──────────┬───────────┘                         └──────────┬───────────┘
           │                                                │
           └────────────────────────┬───────────────────────┘
                                    │
                       ┌────────────▼────────────┐
                       │ ⚔️ Cross-Examination    │
                       │  Contradiction Engine   │
                       └────────────┬────────────┘
                                    │
                       ┌────────────▼────────────┐
                       │ 🏛️ Chairman Synthesis   │
                       │ Consensus & Final Score │
                       └────────────┬────────────┘
                                    │
                       ┌────────────▼────────────┐
                       │  🔍 War Room Auditor    │
                       │ Sentiment & Calibration │
                       └────────────┬────────────┘
                                    │
                       ┌────────────▼────────────┐
                       │ Firestore + SSE Stream  │
                       └─────────────────────────┘
```

---

## 🤖 The Executive Board Roster

| Agent Role | Domain Focus | Primary Evaluation Metrics |
|---|---|---|
| 👔 **Marcus Vance (CEO)** | Vision & Strategy | Market sizing, mission clarity, strategic moat, scalability |
| ⚙️ **Dr. Aris Thorne (CTO)** | Technical Architecture | MVP scope, technical stack complexity, security, scalability |
| 💰 **Priya Desai (Investor)** | Financial Viability | Unit economics, CAC/LTV ratio, monetization model, burn rate |
| 👤 **Samir Khan (Customer)** | Product-Market Fit | Pain point urgency, UX friction, willingness-to-pay |
| 📢 **Elena Rostova (CMO)** | Growth & Acquisition | Customer acquisition channels, viral loops, branding |
| 🎯 **Competitor Specialist** | Market Landscape | Competitive landscape, saturation, differentiation |
| ⚠️ **Dr. Quinn Hayes (Risk)** | Governance & Risk | Regulatory compliance, legal liabilities, operational risks |
| 💀 **Grim Reaper** | Failure Analysis | Identifies fatal flaws, failure probability, startup autopsy |
| 🏛️ **Board Chair** | Executive Synthesis | Resolves agent splits, calculates weighted score, issues final verdict |

---

## 📁 Repository Structure

```
Founders-War-Room/
├── api/
│   └── index.js                    # Vercel Serverless Function entry point
├── server/
│   ├── index.js                    # Express API server entry
│   ├── routes/
│   │   └── analyze.js              # Streaming & standard POST /api/analyze endpoints
│   └── agents/
│       ├── azureClient.js          # Azure AI Foundry & OpenAI client
│       ├── definitions.js          # Agent prompts & JSON schemas
│       ├── orchestrator.js         # Multi-agent execution pipeline
│       └── crossExamination.js     # Contradiction detection engine
├── src/
│   ├── main.jsx                    # React 19 root entry
│   ├── App.jsx                     # View router & auth state management
│   ├── firebase.js                 # Firebase Auth & Cloud Firestore setup
│   ├── index.css                   # Global design tokens, animations & styling
│   ├── components/
│   │   ├── Dashboard.jsx           # Main founder dashboard & recent startup cards
│   │   ├── BoardroomScene.jsx      # Live boardroom debate, radial stage & events feed
│   │   ├── IdeaForm.jsx            # Pitch submission form with versioning banner
│   │   ├── EvolutionTimeline.jsx   # V1→V2 score chart & version comparison tool
│   │   ├── ReportsView.jsx         # Executive report memo & PDF exporter
│   │   ├── SettingsView.jsx        # Account settings & Free Plan quota tracker
│   │   └── auth/                   # Protected routes, Login, Signup & Password Reset
│   └── utils/
│       ├── api.js                  # SSE Stream client & simulation engine
│       └── storage.js              # Firestore & user-scoped localStorage manager
├── firestore.rules                 # Security rules for multi-tenant data isolation
├── vercel.json                     # Vercel SPA rewrites & serverless configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Firebase Project**: Enabled Auth (Email & Google) and Cloud Firestore
- **Azure AI Foundry or OpenAI API Key**: Model deployment (GPT-4o)

---

### Local Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/M0izz/Founders-War-Room.git
   cd Founders-War-Room
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   # Azure AI Foundry / OpenAI Configuration
   AZURE_API_KEY=your_azure_openai_api_key
   AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/openai/v1
   AZURE_DEPLOYMENT_NAME=gpt-4o
   AZURE_API_VERSION=2025-01-01-preview

   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # Server Port
   PORT=3001
   ```

4. **Run Development Mode**
   ```bash
   # Terminal 1: Run Frontend Dev Server (Vite)
   npm run dev

   # Terminal 2: Run Backend API Server (Express)
   npm run server
   ```

5. **Access the App**
   Open `http://localhost:5173` in your browser.

---

## 🔒 Security & Data Privacy

Founder's War Room enforces strict **Multi-Tenant User Isolation**:
- **Firestore Security Rules**: [firestore.rules](firestore.rules) ensures `read` and `write` operations are strictly authorized when `request.auth.uid == resource.data.userId`.
- **Per-User Local Storage**: Storage keys are dynamically scoped (`warroom_history_{uid}`) on auth resolution and cleared on sign-out.
- **Firestore Subcollections**: Startup snapshots are archived in isolated paths (`startups/{startupId}/versions/{versionId}`).

---

## 🛠️ Built With

- **Frontend**: [React 19](https://react.dev/), [Vite 8](https://vitejs.dev/), Vanilla CSS3 (Glassmorphism & CSS Grid)
- **Backend**: Node.js, Express.js Serverless Functions
- **AI Infrastructure**: [Azure AI Foundry](https://ai.azure.com/) / GPT-4o
- **Database & Auth**: [Firebase Auth](https://firebase.google.com/docs/auth) & [Cloud Firestore](https://firebase.google.com/docs/firestore)
- **Deployment**: [Vercel Platform](https://vercel.com/)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Made with ❤️ by <strong>Founder's War Room AI Team</strong>
</p>
