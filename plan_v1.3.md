# DClaw Backup — v1.3 Strategic Product Roadmap

> **Status:** Draft | **Date:** 2026-05-16 | **Author:** DClaw Agent
> **Repo:** `dclawstack/dclaw-backup`
> **Backend Port:** `8032` | **Frontend Port:** `3032` | **Database:** `dclaw_backup`

---

## Executive Summary

DClaw Backup is an **AI-native, immutable backup platform** for modern development teams and SMBs. It solves the "hair-on-fire" problem of data loss, ransomware, and unguided disaster recovery by combining:

1. **Immutable WORM backups** — Write-once storage with air-gap capability
2. **AI Recovery Copilot** — LLM-guided restore with natural language queries
3. **Cross-cloud resilience** — Multi-cloud replication without vendor lock-in
4. **Ransomware detection** — Real-time entropy analysis on backup streams

### Target ICP
- **Primary:** DevOps teams at fast-growing startups (20–200 employees)
- **Secondary:** SMBs with regulated data (healthcare, fintech)
- **Pain:** Existing tools (Veeam, Commvault) are too complex/expensive; cloud-native tools (AWS Backup) lack cross-cloud and AI features

### Competitive Moat
- **Technical:** Block-level deduplication + ML-powered anomaly detection
- **UX:** "Chat with your backups" — natural language recovery
- **Trust:** Immutable by default, compliance-ready audit trails

---

## YC Pitch Angle

> **One-liner:** "GitHub Copilot for backups — an AI that protects, monitors, and recovers your data across any cloud."

**Problem:** 60% of SMBs that lose data shut down within 6 months. Existing backup tools are either too complex (enterprise) or too limited (cloud-native). Recovery is a manual, error-prone process that takes hours.

**Solution:** DClaw Backup makes backups intelligent and recovery conversational. It automatically detects ransomware, ensures immutability, and lets you recover with plain English: "Restore yesterday's database to staging at 3pm."

**Market:** $20B+ data protection market growing at 14% CAGR. Cloud-native backup is the fastest-growing segment.

**Traction:** [Post-build metric] — Target: 10 design partners, 3 paid pilots by Demo Day.

---

## Current State Inventory

| Component | Status | Gap |
|-----------|--------|-----|
| FastAPI scaffold | ✅ Working | Needs real routers |
| SQLAlchemy 2.0 Base | ✅ DeclarativeBase | Needs backup domain models |
| Next.js 14 + Tailwind | ✅ Scaffold | Needs pages/components |
| Pre-built UI components | ✅ Present | Needs integration |
| Docker + Compose | ✅ Configured | Ports misaligned (8120 vs 8032) |
| Helm chart | ✅ Present | Needs label updates |
| CI/CD | ✅ `.github/workflows/ci.yml` | Needs backend + frontend tests |
| Alembic | ✅ Initialized | No migrations exist |
| Test harness | ✅ `conftest.py` | Only 1 health test |
| **Mock data in backup.py** | ❌ **CRITICAL** | Must be replaced with real DB CRUD |
| **Frontend pages** | ❌ **EMPTY** | Only placeholder homepage |
| **Real models** | ❌ **MISSING** | No backup entities defined |

---

## Feature Roadmap (Complexity-Based)

### 🔵 Complexity 0 — Core Foundational Elements (Quick Wins)
*Goal: Establish real database-backed CRUD, fix config drift, make the app demo-ready.*

#### C0.1 — Fix Configuration Drift ⏱️ 1h
- **Problem:** Ports and names are inconsistent across files
- **Tasks:**
  - Update `AGENTS.md`: Backend `8032`, Frontend `3032`, DB `dclaw_backup`
  - Update `docker-compose.yml`: Backend `8032:8032`, Frontend `3032:3032`
  - Update `backend/Dockerfile`: `ENV PORT=8032`, `EXPOSE 8032`
  - Update `frontend/Dockerfile`: `ENV PORT=3032`, `EXPOSE 3032`
  - Update `frontend/package.json` scripts: `--port 3032`
  - Update `backend/app/core/config.py`: `app_name = "DClaw Backup"`, default DB `dclaw_backup`
  - Update `frontend/src/app/layout.tsx`: Title → "DClaw Backup"

#### C0.2 — Define Core Domain Models ⏱️ 2h
- **Entities:**
  - `BackupJob` — id, name, source_type, source_config, target_config, schedule_cron, retention_days, compression_enabled, encryption_enabled, status, created_at, updated_at
  - `BackupSource` — id, job_id (FK), type ["database", "filesystem", "s3", "vm"], connection_string, credentials_ref, metadata, created_at
  - `BackupRun` — id, job_id (FK), started_at, completed_at, status ["running", "success", "failed", "cancelled"], size_bytes, compression_ratio, dedup_ratio, error_message, created_at
  - `RestoreJob` — id, backup_run_id (FK), target_path, status, started_at, completed_at, verify_checksum, created_at
  - `StorageTarget` — id, name, type ["s3", "azure_blob", "gcs", "local", "sftp"], config, immutable_enabled, region, created_at
- **Rules:** All use `Mapped[...]` + `mapped_column()`, `lazy="selectin"`, `ondelete="CASCADE"` where appropriate

#### C0.3 — Create Pydantic Schemas ⏱️ 1h
- Schemas for all 5 entities (Create, Update, Response, List)
- `ConfigDict(from_attributes=True)` on all response schemas

#### C0.4 — Implement BaseRepository + Entity Repositories ⏱️ 2h
- Extend `BaseRepository` for each entity
- Methods: `get_by_id`, `list_all`, `create`, `update`, `delete`, `get_by_job_id` (for runs)

#### C0.5 — Build CRUD API Routers ⏱️ 2h
- `POST /api/v1/backup-jobs`, `GET /api/v1/backup-jobs`, `GET/PUT/DELETE /api/v1/backup-jobs/{id}`
- `POST /api/v1/backup-runs`, `GET /api/v1/backup-runs`, `GET /api/v1/backup-runs/{id}`
- `GET /api/v1/backup-runs/job/{job_id}` — history for a job
- `POST /api/v1/restore-jobs`, `GET /api/v1/restore-jobs`, `GET/PUT/DELETE /api/v1/restore-jobs/{id}`
- `POST /api/v1/storage-targets`, `GET /api/v1/storage-targets`, `GET/PUT/DELETE /api/v1/storage-targets/{id}`
- Wire all in `app/api/main.py`

#### C0.6 — Write Backend Tests ⏱️ 2h
- 70%+ coverage target for all new endpoints
- Test create, read, update, delete, list, filtering
- Use `httpx.AsyncClient` + `ASGITransport`

#### C0.7 — Generate Alembic Migration ⏱️ 30m
- `alembic revision --autogenerate -m "initial_backup_domain"`
- Verify migration applies cleanly

#### C0.8 — Build Frontend API Client ⏱️ 1h
- Add typed API functions to `src/lib/api.ts` for all endpoints
- Define TypeScript interfaces for all entities

#### C0.9 — Build Core Frontend Pages ⏱️ 4h
- **Dashboard** (`/`) — Summary cards, recent backup runs, quick actions
- **Backup Jobs** (`/backup-jobs`) — Table with search/filter, create modal
- **Backup Job Detail** (`/backup-jobs/[id]`) — Job info + run history table
- **Restore Jobs** (`/restore-jobs`) — List with status badges
- **Storage Targets** (`/storage-targets`) — Configuration list
- Use pre-built UI components: Card, Table, Button, Badge, Dialog, Input, Select, Tabs

#### C0.10 — Navigation & Layout ⏱️ 1h
- Sidebar or top navigation linking all pages
- Consistent layout wrapper in `layout.tsx`

---

### 🟡 Complexity 1 — Core Differentiators (Medium Effort)
*Goal: Add AI features, dashboard analytics, and security basics that differentiate from plain backup tools.*

#### C1.1 — AI Backup Copilot (Recovery Advisor) ⏱️ 6h
- **Backend:**
  - `POST /api/v1/ai/backup-chat` — conversational recovery assistant
  - Context: job health, recent runs, storage usage
  - Mock LLM integration (ready for OpenAI/Anthropony swap)
  - Health scoring engine: score 0-100 based on recency, success rate, coverage
- **Frontend:**
  - AI panel component (`/components/backup-copilot.tsx`)
  - Chat interface with message history
  - Recovery recommendation cards

#### C1.2 — Dashboard Analytics ⏱️ 3h
- **Backend:** `GET /api/v1/dashboard` — aggregated stats
  - total_jobs, total_runs, success_rate, total_storage_gb, compression_savings_gb, recent_failures
- **Frontend:**
  - Summary cards with icons
  - Recent activity feed
  - Storage savings visualization
  - Success/failure rate badges

#### C1.3 — Backup Run Simulation Engine ⏱️ 3h
- **Backend:** `POST /api/v1/backup-jobs/{id}/run` — trigger a simulated backup run
  - Updates BackupRun with realistic size, compression, duration
  - Randomly assigns success/failure with configurable probability
- **Frontend:** "Run Now" button on job detail page with progress spinner

#### C1.4 — Storage Target Validation ⏱️ 2h
- **Backend:** `POST /api/v1/storage-targets/{id}/test` — connectivity validation
  - Test S3/Azure/GCS credentials and bucket access
- **Frontend:** Test connection button with success/failure toast

#### C1.5 — Global Search ⏱️ 2h
- Search across backup jobs, runs, and restore jobs
- `GET /api/v1/search?q={query}`
- Frontend search bar in navigation

---

### 🔴 Complexity 2 — Advanced Features (High Effort)
*Goal: Security-first features, AI automation, and enterprise-grade capabilities.*

#### C2.1 — Immutable & Air-Gapped Backup Support ⏱️ 6h
- **Backend:**
  - Add `immutable_ttl_days`, `air_gap_enabled` to `StorageTarget`
  - Object lock / legal hold simulation logic
  - Compliance audit trail table (`AuditLog`)
- **Frontend:** Immutability toggle in storage target config, compliance badge

#### C2.2 — Ransomware Detection Engine ⏱️ 8h
- **Backend:**
  - Entropy analysis module (`app/services/ransomware_scan.py`)
  - File extension change detection
  - Anomaly scoring on backup run deltas
  - Alert table (`SecurityAlert`): id, type, severity, message, backup_run_id, acknowledged
- **Frontend:** Threat alert dashboard, alert detail modal, acknowledge action

#### C2.3 — Cross-Cloud Replication Topology ⏱️ 6h
- **Backend:**
  - `ReplicationPolicy` model: source_target_id, dest_target_id, schedule, enabled
  - `ReplicationRun` model: track replication jobs
  - `GET /api/v1/replication-policies` CRUD
- **Frontend:** Topology map visualization (simple node-based SVG/graph), replication status

#### C2.4 — Retention Policy Engine ⏱️ 4h
- **Backend:**
  - `RetentionPolicy` model: job_id, daily_count, weekly_count, monthly_count, yearly_count, legal_hold
  - GFS (Grandfather-Father-Son) simulation
  - Automated retention cleanup job (simulated)
- **Frontend:** Policy editor, calendar view of retained backups

#### C2.5 — Backup Testing Automation ⏱️ 5h
- **Backend:**
  - `BackupTest` model: backup_run_id, test_status, validation_results
  - Automated restore-to-sandbox validation
  - Report generation endpoint
- **Frontend:** Test schedule config, test results list, validation report viewer

---

## Implementation Priority (Sequential Sprints)

### Sprint 1: Foundation (C0.1 – C0.10)
**Goal:** Working application with real database CRUD, clean config, and basic frontend.
**Duration:** ~3–4 dev days
**Deliverable:** `docker compose up -d` starts a fully functional backup management app with real data.

### Sprint 2: Intelligence (C1.1 – C1.5)
**Goal:** AI copilot, dashboard analytics, simulated runs.
**Duration:** ~3–4 dev days
**Deliverable:** Dashboard with charts, AI chat panel, demo-ready "Run Now" flow.

### Sprint 3: Security (C2.1 – C2.3)
**Goal:** Immutability, ransomware detection, cross-cloud replication.
**Duration:** ~4–5 dev days
**Deliverable:** Enterprise security features, threat dashboard, replication topology.

### Sprint 4: Automation (C2.4 – C2.5)
**Goal:** Retention policies, automated testing.
**Duration:** ~3–4 dev days
**Deliverable:** Policy-driven lifecycle management, automated validation.

---

## Technical Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| PostgreSQL (not SQLite) | Asyncpg + real production parity. SQLite lacks async driver quality. |
| SQLAlchemy 2.0 + DeclarativeBase | Industry standard, type-safe, scaffold-aligned |
| Repository pattern | Clean separation, testable, consistent with scaffold |
| Pydantic v2 | Modern Python data validation, auto-generated OpenAPI |
| Next.js 14 App Router | Scaffold standard, SSR for SEO/dashboard |
| Tailwind + pre-built UI | No shadcn CLI dependency, faster builds |
| Mock LLM (configurable) | Enables demo without API keys; swap to OpenAI in 1 line |

---

## Database Schema Summary

```
backup_job          →  backup_source (1:N)
backup_job          →  backup_run (1:N)
backup_job          →  storage_target (N:1)
backup_run          →  restore_job (1:N)
backup_run          →  security_alert (1:N)
storage_target      →  replication_policy (1:N)
backup_job          →  retention_policy (1:1)
backup_run          →  backup_test (1:N)
```

---

## Testing Strategy

| Layer | Tool | Target |
|-------|------|--------|
| Unit (repos) | pytest + async | 80%+ coverage |
| API | pytest + httpx | All endpoints |
| Integration | docker compose | End-to-end flow |
| Frontend build | `npm run build` | Zero build errors |

---

## Metrics & Success Criteria

| Metric | Target |
|--------|--------|
| Backend test coverage | ≥ 70% |
| Frontend build | ✅ Pass |
| Docker healthchecks | All services healthy |
| API response time | p95 < 200ms (local) |
| Demo readiness | 5-minute backup→restore demo |

---

## Risk Register

| Risk | Mitigation |
|------|------------|
| Port conflicts | Use 8032/3032 consistently; document in AGENTS.md |
| Mock data persistence | Repository layer + real DB from day 1 |
| LLM API costs | Abstract behind interface; default to mock responses |
| shadcn CLI temptation | Use pre-built components only; document in AGENTS.md |
| Test flakiness | Use `NullPool` in tests; deterministic fixtures |

---

## Next Actions (Sprint 1 Kickoff)

1. Execute C0.1 — Fix all config drift in one atomic commit
2. Execute C0.2 — Write all 5 core models
3. Execute C0.3 — Write all Pydantic schemas
4. Execute C0.4 — Implement repositories
5. Execute C0.5 — Build CRUD routers
6. Execute C0.6 — Write backend tests
7. Execute C0.7 — Generate alembic migration
8. Execute C0.8–C0.10 — Build frontend pages
9. Commit with conventional commits: `feat(backend): ...`, `feat(frontend): ...`
10. Run `docker compose up -d` and verify end-to-end

---

> **Note:** This plan replaces `PLAN-v1.2.md`. The previous plan had valid feature ideas but was not implementable due to missing foundational infrastructure. v1.3 prioritizes "make it real" before "make it AI."
