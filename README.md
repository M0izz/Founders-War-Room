# 🏛️ Founder's War Room

> **Before the Market Judges You, We Will.**

[![Azure AI Foundry](https://img.shields.io/badge/Azure%20AI-Foundry-0078D4?style=for-the-badge&logo=microsoft-azure)](https://ai.azure.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Express](https://img.shields.io/badge/Express.js-4-000000?style=for-the-badge&logo=express)](https://expressjs.com)

## 🎯 What Is This?

Founder's War Room is an AI-powered virtual boardroom where entrepreneurs submit startup ideas and receive analysis from a panel of 8 specialized AI agents — each with a distinct role, personality, and evaluation criteria.

**This is NOT a chatbot.** This is a multi-agent reasoning pipeline that analyzes, debates, predicts failure, decides, and validates — simulating a real boardroom of expert stakeholders.

## 🧠 Architecture: The Reasoning Pipeline

```
Analyze → Challenge → Predict Failure → Decide → Validate
```

```
User Submits Idea
       ↓
Backend Orchestrator
       ↓
┌──────────────────────────────────────────┐
│  7 Core Agents (Parallel)                │
│  CEO · CTO · Investor · Customer         │
│  Marketing · Competitor · Risk Advisor   │
└──────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│  💀 Grim Reaper (Sequential)             │
│  Reads ALL 7 agents' findings            │
│  Answers: "What kills this startup?"     │
└──────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│  ⚔️ Cross-Examination Engine             │
│  Detects contradictions between agents   │
│  Forces agents to defend or revise       │
└──────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│  🏛️ Chairman Verdict                     │
│  Compares opinions, resolves splits      │
│  Issues reasoned verdict with logic      │
└──────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│  🔍 War Room Auditor                     │
│  Validates score consistency             │
│  Detects hallucinations & contradictions │
└──────────────────────────────────────────┘
       ↓
   Final Report → UI
```

## 🤖 The 8 AI Agents

| Agent | Role | Focus |
|-------|------|-------|
| 👔 **CEO** | Vision Strategist | Mission, scalability, market positioning |
| ⚙️ **CTO** | Feasibility Engineer | Technical architecture, MVP scope, complexity |
| 💰 **Investor** | Business Viability Analyst | Unit economics, CAC/LTV, funding readiness |
| 👤 **Customer** | Demand Validator | Problem urgency, willingness to pay, alternatives |
| 📢 **Marketing** | Growth Architect | Acquisition channels, viral potential, brand |
| 🎯 **Competitor** | Market Landscape Analyst | Competitors, saturation, differentiation |
| ⚠️ **Risk Advisor** | Operational Risk Analyst | Legal, regulatory, execution, compliance |
| 💀 **Grim Reaper** | Death Predictor | Fatal assumptions, failure probability, survival |

Each agent returns:
- **Score** (0-10)
- **Confidence** (0.0-1.0)
- Key observations, strengths, concerns, recommendations

## 🔥 Key Differentiators

### Cross-Examination (Second-Order Reasoning)
When agents disagree (e.g., Investor says "huge market" but Customer says "I wouldn't pay"), the engine detects the contradiction and asks the conflicting agent to defend or revise their position. This creates **debate, reflection, and genuine reasoning**.

### Sequential Grim Reaper
The Grim Reaper doesn't analyze the raw idea — it reads ALL 7 agents' findings and synthesizes a **Startup Autopsy**: ranked causes of death with evidence from each agent.

### Chairman Verdict (Not Simple Aggregation)
The Chairman doesn't average scores. It identifies **consensus** (where agents agree), resolves **disagreements** (weighing by confidence), and issues a **reasoned verdict with a logic chain**.

### War Room Auditor (Quality Validation)
Deterministic checks for score-sentiment consistency, confidence calibration, cross-examination coverage, and recommendation alignment. No LLM — pure logic.

### 🦈 Shark Tank Mode
Toggle that transforms the entire experience from collaborative to adversarial. Agents become brutally critical. The Grim Reaper shows no mercy.

### Version Memory
Resubmit the same startup with improvements — the War Room compares versions and shows score deltas.

## 🏗️ Foundry IQ Integration

This project integrates **Azure AI Foundry** (Foundry IQ) through:

1. **Azure AI Agent Service** — 8 specialized agents created and managed via the Azure OpenAI API provisioned through Foundry
2. **Model Deployment** — GPT-4o model deployed via Azure AI Foundry project
3. **Structured Agent Outputs** — JSON-formatted responses with confidence metrics enabling cross-agent reasoning
4. **Multi-Agent Orchestration** — Foundry infrastructure handles parallel model invocations for concurrent agent analysis
5. **Project Management** — All resources managed under a single Foundry project (`agentleague42`)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Azure AI Foundry project with GPT-4o deployment
- API key from Azure AI Foundry portal

### Setup

```bash
# Clone the repo
git clone <repo-url>
cd founders-war-room-ai

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Configure environment
cp .env.example .env
# Edit .env with your Azure credentials
```

### Run

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
npm run dev
```

Open `http://localhost:5173`

## 📊 Output

### Final Report Includes
- Executive Summary
- 5 Composite Scores (Health, Investment Readiness, Market Potential, Risk Index, Innovation)
- SWOT Analysis
- Cross-Examination Highlights
- Startup Autopsy (Grim Reaper)
- Chairman's Reasoned Verdict
- Audit Quality Badge
- Top 3 Next Actions
- Final Recommendation: INVEST / INVEST WITH CONDITIONS / IMPROVE / PIVOT / REJECT

### Export
- PDF export of full War Room report
- Session history saved locally

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React + Vite | Frontend SPA |
| Vanilla CSS | Premium dark UI with glassmorphism |
| Express.js | Backend API & orchestration |
| Azure AI Foundry | AI agent platform |
| GPT-4o (Azure) | Model powering all 8 agents |
| html2pdf.js | PDF report export |
| LocalStorage | Session history & version memory |

## 📁 Project Structure

```
├── index.html              # Entry HTML
├── src/
│   ├── main.jsx            # React entry
│   ├── App.jsx             # Main app (state, routing)
│   ├── index.css           # Full design system
│   ├── components/
│   │   ├── Landing.jsx     # Landing page
│   │   ├── IdeaForm.jsx    # Idea submission form
│   │   ├── Boardroom.jsx   # Results view
│   │   ├── AgentCard.jsx   # Individual agent card
│   │   ├── GrimReaper.jsx  # Startup Autopsy
│   │   ├── CrossExamination.jsx
│   │   ├── ChairmanVerdict.jsx
│   │   ├── WarRoomAuditor.jsx
│   │   ├── ScoreDashboard.jsx
│   │   ├── FinalReport.jsx
│   │   ├── VersionHistory.jsx
│   │   └── LoadingPipeline.jsx
│   └── utils/
│       ├── api.js          # Backend API client
│       └── storage.js      # LocalStorage utility
├── server/
│   ├── index.js            # Express server
│   ├── routes/
│   │   └── analyze.js      # POST /api/analyze
│   └── agents/
│       ├── azureClient.js  # Azure OpenAI client
│       ├── definitions.js  # 8 agent prompts
│       ├── orchestrator.js # Pipeline logic
│       ├── crossExamination.js
│       ├── chairmanVerdict.js
│       └── auditor.js      # Deterministic validation
├── .env                    # Azure credentials
└── README.md
```
## 🚀 Planned Enhancements (Wow Factors)

- **Iterative Scoring Loop**: auto‑regenerate, re‑score until overall score ≥ 8.5, with version history and diff view.
- **Full Deliverable Suite**: PRD, Lean Canvas, Business Model Canvas, GTM plan, Pricing, MVP roadmap, Landing‑page copy, Investor pitch deck, Technical architecture.
- **Persistent Version Memory**: stores each idea submission, shows score evolution, side‑by‑side comparisons, undo/branch.
- **Execution Engine (Codex)**: one‑click GitHub repo creation, auto‑generated issues, README, starter code scaffold.
- **Premium Visual Experience**: dark‑mode, glassmorphism, animated score rings, responsive layout.

```
