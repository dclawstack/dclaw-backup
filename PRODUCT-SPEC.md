# PRODUCT-SPEC: DClaw Backup

## Overview

**App Name:** DClaw Backup
**Domain:** Data Protection & Immutable Backup Management
**Target User:** DevOps teams, SMBs with regulated data

## Core Entities

### StorageTarget
```
StorageTarget
├── id: UUID (PK)
├── name: str (required)
├── target_type: enum ["s3", "azure_blob", "gcs", "local", "sftp"]
├── config: str (optional, JSON)
├── region: str (optional)
├── immutable_enabled: bool (default false)
├── created_at: datetime
└── updated_at: datetime
```

### BackupJob
```
BackupJob
├── id: UUID (PK)
├── name: str (required)
├── description: str (optional)
├── source_type: enum ["database", "filesystem", "s3", "vm"]
├── source_config: str (optional, JSON)
├── schedule_cron: str (optional)
├── retention_days: int (default 30)
├── compression_enabled: bool (default true)
├── encryption_enabled: bool (default true)
├── status: enum ["active", "paused", "failed"] (default "active")
├── storage_target_id: UUID (FK → StorageTarget, ondelete=SET NULL)
├── created_at: datetime
└── updated_at: datetime
```

### BackupSource
```
BackupSource
├── id: UUID (PK)
├── backup_job_id: UUID (FK → BackupJob, ondelete=CASCADE)
├── source_type: str (required)
├── connection_string: str (optional)
├── credentials_ref: str (optional)
├── metadata_json: str (optional)
└── created_at: datetime
```

### BackupRun
```
BackupRun
├── id: UUID (PK)
├── backup_job_id: UUID (FK → BackupJob, ondelete=CASCADE)
├── started_at: datetime (optional)
├── completed_at: datetime (optional)
├── status: enum ["pending", "running", "success", "failed", "cancelled"]
├── size_bytes: int (BigInteger)
├── compression_ratio: float (default 0)
├── dedup_ratio: float (default 0)
├── error_message: str (optional)
└── created_at: datetime
```

### RestoreJob
```
RestoreJob
├── id: UUID (PK)
├── backup_run_id: UUID (FK → BackupRun, ondelete=CASCADE)
├── target_path: str (optional)
├── status: enum ["pending", "running", "completed", "failed"]
├── started_at: datetime (optional)
├── completed_at: datetime (optional)
├── verify_checksum: bool (default true)
├── created_at: datetime
└── updated_at: datetime
```

## User Stories / Screens

### Screen 1: Dashboard
- Summary cards: total jobs, total runs, success rate, storage used, targets, restores
- Quick action buttons (manage jobs, manage targets)

### Screen 2: Backup Jobs
- Table view with search, status filter
- Create job modal with source type, schedule, retention
- Run now button per job
- Delete with confirmation

### Screen 3: Backup Job Detail
- Job info cards (status, compression, encryption, retention)
- Recent runs table with size, compression, timestamps
- Run now button

### Screen 4: Backup Runs
- Table view of all runs
- Filter by job
- Status badges, size formatting
- Error messages for failed runs

### Screen 5: Restore Jobs
- Table view of restore jobs
- Create restore job modal (select run, target path)
- Status badges

### Screen 6: Storage Targets
- Table view of targets
- Create target modal (name, type, region, immutability toggle)
- Delete with confirmation

## AI Features (v1.3 Roadmap)

- **AI Backup Copilot:** Conversational recovery assistant
- **Ransomware Detection:** Entropy analysis on backup streams
- **Cross-Cloud Replication:** Multi-cloud sync policies
- **Immutable Backups:** WORM storage with compliance audit trail

## API Endpoints (v1.0)

```
GET    /api/v1/storage-targets          → List targets
POST   /api/v1/storage-targets          → Create target
GET    /api/v1/storage-targets/{id}     → Get target
PUT    /api/v1/storage-targets/{id}     → Update target
DELETE /api/v1/storage-targets/{id}     → Delete target

GET    /api/v1/backup-jobs              → List jobs
POST   /api/v1/backup-jobs              → Create job
GET    /api/v1/backup-jobs/{id}         → Get job (with sources & runs)
PUT    /api/v1/backup-jobs/{id}         → Update job
DELETE /api/v1/backup-jobs/{id}         → Delete job
POST   /api/v1/backup/jobs/{id}/run     → Trigger backup run

GET    /api/v1/backup-runs              → List runs
POST   /api/v1/backup-runs              → Create run
GET    /api/v1/backup-runs/{id}         → Get run
PUT    /api/v1/backup-runs/{id}         → Update run
DELETE /api/v1/backup-runs/{id}         → Delete run

GET    /api/v1/restore-jobs             → List restores
POST   /api/v1/restore-jobs             → Create restore
GET    /api/v1/restore-jobs/{id}        → Get restore
PUT    /api/v1/restore-jobs/{id}        → Update restore
DELETE /api/v1/restore-jobs/{id}        → Delete restore
```

## Non-Functional Requirements

- Backend tests: 70%+ coverage
- Frontend: Responsive, Tailwind + pre-built UI components
- Docker: All services start with `docker compose up -d`
- No mock data — everything persisted to PostgreSQL
- Alembic migrations for all schema changes
