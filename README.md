# LexCore — AI-Powered Intelligence Platform

> **BBA Services | Build. Bank. Ascend.**

LexCore is a production-grade, AI-powered intelligence platform serving as a comprehensive research, compliance, and execution engine for **law, tax, real estate, genealogy, heritage, and political monitoring**.

---

## Architecture

```
lexcore/
├── apps/web/                    # Admin Console + Research Workstation (React + TypeScript)
├── apps/client-portal/          # Client-facing portal (React + TypeScript)
├── services/api/                # FastAPI gateway (Python 3.12)
├── services/orchestrator/       # Workflow router + risk scoring
├── services/workflow-runtime/   # LangGraph durable execution
├── services/agents/             # 8 domain agents
│   ├── intake/                  # Agent 1 — Intake Classifier
│   ├── legal_research/          # Agent 2 — Legal Research
│   ├── doc_intel/               # Agent 3 — Document Intelligence
│   ├── real_estate/             # Agent 4 — Real Estate Analyst
│   ├── heritage/                # Agent 5 — Heritage Research
│   ├── tax_strategy/            # Agent 6 — Tax Strategy
│   ├── political/               # Agent 7 — Political Intelligence
│   └── drafting/                # Agent 8 — Drafting & Execution
├── services/connectors/         # Email/calendar/county/archives/RE data
├── services/doc-intel/          # PDF + OCR + entity extraction
├── services/intel-engine/       # Knowledge graph + alerts + self-heal
├── packages/schemas/            # Canonical JSON Schemas (single source of truth)
├── packages/domain-packs/       # Versioned domain configurations
├── packages/evals/              # CI evaluation harness + graders
└── infra/
    ├── terraform/               # AWS infrastructure (VPC, RDS, Redis, ECS)
    └── k8s/                     # Kubernetes manifests
```

## Three-Portal Architecture

| Portal | URL | Users |
|--------|-----|-------|
| Admin Console | `localhost:3000` | BBA Services Staff |
| Client Portal | `localhost:3001` | Individual & Business Clients |
| API | `localhost:8000/api/docs` | All portals |

## Quick Start

```bash
# 1. Copy environment config
cp .env.example .env
# Edit .env with your API keys

# 2. Start all services
docker-compose up -d

# 3. Run database migrations
docker-compose exec api alembic upgrade head

# 4. Access portals
# Admin Console: http://localhost:3000
# Client Portal: http://localhost:3001
# API Docs:      http://localhost:8000/api/docs
```

## Development Setup

### Backend (FastAPI)
```bash
cd services/api
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend (React)
```bash
cd apps/web
npm install
npm run dev
```

### Run Tests
```bash
# API tests
cd services/api && pytest tests/ -v

# Agent tests
cd services/agents && python -m pytest tests/ -v

# Schema validation
cd packages/schemas && node scripts/validate.js

# Frontend tests
cd apps/web && npm test
```

## 8 Master Research Prompts

| # | Prompt | Domain |
|---|--------|--------|
| 1 | Cross-Jurisdictional Gap Finder | Legal |
| 2 | Document Intelligence Parser | Legal |
| 3 | Strategy & Precedent Builder | Legal |
| 4 | Genealogy & Heritage Deep Dive | Heritage |
| 5 | Real Estate Due Diligence Package | Real Estate |
| 6 | Political Intelligence Monitor | Political |
| 7 | International Tax & Treaty Analyzer | Tax |
| 8 | Adaptive Learning Research Session | All |

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: FastAPI + Python 3.12 + SQLAlchemy + Alembic
- **Orchestration**: LangGraph (durable execution + checkpoints)
- **AI**: Claude API (Anthropic) — primary reasoning
- **Vector Search**: Pinecone
- **Document Store**: S3 + Textract/Tesseract OCR
- **Database**: PostgreSQL 16
- **Event Bus**: Redis Streams / Apache Kafka
- **Infrastructure**: AWS (ECS, RDS, ElastiCache) + Kubernetes
- **CI/CD**: GitHub Actions

## Security

- ✅ Approval gates on all side-effect actions
- ✅ JWT authentication with RBAC
- ✅ Tenant isolation at every layer
- ✅ Append-only audit log (immutable)
- ✅ PII redaction before LLM processing
- ✅ Draft-only — no auto-send/auto-file
- ✅ TLS 1.3 in transit, AES-256 at rest
- ✅ Least privilege per agent domain

## Build Phases

- **Phase 1** (Weeks 1–5): Foundation — Auth, RBAC, Schemas, Approval Queue ✅
- **Phase 2** (Weeks 6–13): Document Intelligence — PDF/OCR, Vector Store, Heritage Engine
- **Phase 3** (Weeks 14–19): Legal Domain Packs — Tax, International, Case Law
- **Phase 4** (Weeks 20–25): Real Estate Engine — Title, Zoning, PropStream/ATTOM
- **Phase 5** (Weeks 26–33): Orchestration Hardening — LangGraph, MCP, Auto-Heal
- **Phase 6** (Weeks 34–45): Adaptive Intelligence — Knowledge Graph, Voice, Fine-tuning

---

*LexCore gives any user — regardless of legal background — the research capability of a fully staffed law firm, tax advisory, and intelligence operation.*
