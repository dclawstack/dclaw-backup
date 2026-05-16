# DClaw Backup — v1.2 Feature Roadmap

> 📘 **REVISED PRD v2.3 available:** See `REVISED-PRD.md` for complete gap analysis, current state, and full feature roadmap.


> Based on: Y Combinator vertical SaaS principles, trending GitHub repos (restic, kopia), AI product research (Veeam, Commvault, Rubrik, Druva)

## Pre-Flight Checklist

- [ ] `frontend/package-lock.json` committed after any `npm install` / dependency change
- [ ] `frontend/next-env.d.ts` exists and is committed
- [ ] `docker-compose.yml` healthchecks correct
- [ ] `frontend/Dockerfile` declares `ARG NEXT_PUBLIC_API_URL` before `RUN npm run build`

## v1.0 Feature Inventory (Current)

- [ ] Backup job CRUD
- [ ] Source/target configuration
- [ ] Schedule management
- [ ] Basic restore
- [ ] Real backend CRUD (no mocks)
- [ ] Docker + Helm deployment
- [ ] Alembic migrations
- [ ] Backend tests

---

## v1.2 Roadmap

### P0 — Must Have (Ship in v1.0, demo-ready)

#### 1. AI Backup Copilot (Recovery Advisor)
**Description:** AI assistant that monitors backup health, suggests optimizations, and guides recovery. "How do I restore yesterday's database to staging?"
- **AI Angle:** Backup health analysis + RAG over recovery procedures. LLM-guided restore.
- **Backend:** `/api/v1/ai/backup-chat` endpoint. Health scoring engine.
- **Frontend:** AI panel with backup status and recovery recommendations.
- **Files:** `backend/app/services/backup_ai.py`, `frontend/src/components/backup-copilot.tsx`

#### 2. Multi-Source Backup Orchestration
**Description:** Backup databases, files, VMs, and cloud resources from single interface.
- **Backend:** Backup agent orchestration. Source adapter framework.
- **Frontend:** Source catalog with connection wizard.
- **Files:** `backend/app/services/orchestrator.py`

#### 3. Incremental & Deduplicated Backups
**Description:** Efficient incremental backups with block-level deduplication and compression.
- **Backend:** Deduplication engine. Delta calculation.
- **Frontend:** Storage savings dashboard.
- **Files:** `backend/app/services/dedup.py`

#### 4. One-Click Restore & Point-in-Time Recovery
**Description:** Browse backups, select files or full restores, point-in-time recovery for databases.
- **Backend:** Restore orchestration. Database PITR engine.
- **Frontend:** Backup browser with timeline. Restore wizard.
- **Files:** `backend/app/services/restore.py`

### P1 — Should Have (v1.1–1.2)

#### 5. Immutable & Air-Gapped Backups
**Description:** WORM storage integration. Air-gap capability for ransomware protection.
- **Backend:** Immutable storage API. Air-gap workflow.
- **Frontend:** Storage target configuration with immutability toggle.

#### 6. Ransomware Detection
**Description:** AI monitors backup data for encryption patterns and alerts on potential ransomware.
- **AI Angle:** Entropy analysis + anomaly detection.
- **Backend:** Ransomware scan engine.
- **Frontend:** Threat alert dashboard.

#### 7. Cross-Cloud Replication
**Description:** Replicate backups across cloud providers (AWS S3 → Azure Blob → GCP Storage).
- **Backend:** Multi-cloud sync engine.
- **Frontend:** Replication topology map.

#### 8. Backup Compliance & Retention
**Description:** Policy-driven retention (GFS, legal hold). Compliance reporting.
- **Backend:** Retention policy engine. Compliance audit trail.
- **Frontend:** Policy editor. Compliance report generator.

### P2 — Could Have (v1.3+)

#### 9. AI-Powered Backup Optimization
**Description:** AI suggests optimal backup windows, frequencies, and retention based on change rates.

#### 10. Disaster Recovery Orchestration
**Description:** Automated failover and failback workflows with runbook automation.

#### 11. Application-Aware Backups
**Description:** Consistent backups for complex apps (databases, message queues, caches).

#### 12. Backup Testing Automation
**Description:** Automated restore testing with validation reports.

---

## Implementation Priority

1. **Week 1–2:** AI Backup Copilot (P0.1) + Multi-Source Orchestration (P0.2)
2. **Week 3–4:** Incremental Backups (P0.3) + Restore (P0.4)
3. **Week 5–6:** Immutable Backups (P1.5) + Ransomware Detection (P1.6)
4. **Week 7–8:** Cross-Cloud Replication (P1.7) + Compliance (P1.8)
