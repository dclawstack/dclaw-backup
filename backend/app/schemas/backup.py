from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, ConfigDict


# ── StorageTarget ──────────────────────────────────────────────

class StorageTargetCreate(BaseModel):
    name: str
    target_type: str
    config: Optional[str] = None
    region: Optional[str] = None
    immutable_enabled: bool = False


class StorageTargetUpdate(BaseModel):
    name: Optional[str] = None
    target_type: Optional[str] = None
    config: Optional[str] = None
    region: Optional[str] = None
    immutable_enabled: Optional[bool] = None


class StorageTargetResponse(BaseModel):
    id: UUID
    name: str
    target_type: str
    config: Optional[str]
    region: Optional[str]
    immutable_enabled: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class StorageTargetList(BaseModel):
    items: list[StorageTargetResponse]
    total: int


# ── BackupJob ──────────────────────────────────────────────────

class BackupJobCreate(BaseModel):
    name: str
    description: Optional[str] = None
    source_type: str
    source_config: Optional[str] = None
    schedule_cron: Optional[str] = None
    retention_days: int = 30
    compression_enabled: bool = True
    encryption_enabled: bool = True
    storage_target_id: Optional[UUID] = None


class BackupJobUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    source_type: Optional[str] = None
    source_config: Optional[str] = None
    schedule_cron: Optional[str] = None
    retention_days: Optional[int] = None
    compression_enabled: Optional[bool] = None
    encryption_enabled: Optional[bool] = None
    status: Optional[str] = None
    storage_target_id: Optional[UUID] = None


class BackupJobResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    source_type: str
    source_config: Optional[str]
    schedule_cron: Optional[str]
    retention_days: int
    compression_enabled: bool
    encryption_enabled: bool
    status: str
    storage_target_id: Optional[UUID]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BackupJobDetailResponse(BackupJobResponse):
    sources: list["BackupSourceResponse"] = []
    runs: list["BackupRunResponse"] = []

    model_config = ConfigDict(from_attributes=True)


class BackupJobList(BaseModel):
    items: list[BackupJobResponse]
    total: int


# ── BackupSource ───────────────────────────────────────────────

class BackupSourceCreate(BaseModel):
    backup_job_id: UUID
    source_type: str
    connection_string: Optional[str] = None
    credentials_ref: Optional[str] = None
    metadata_json: Optional[str] = None


class BackupSourceUpdate(BaseModel):
    source_type: Optional[str] = None
    connection_string: Optional[str] = None
    credentials_ref: Optional[str] = None
    metadata_json: Optional[str] = None


class BackupSourceResponse(BaseModel):
    id: UUID
    backup_job_id: UUID
    source_type: str
    connection_string: Optional[str]
    credentials_ref: Optional[str]
    metadata_json: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BackupSourceList(BaseModel):
    items: list[BackupSourceResponse]
    total: int


# ── BackupRun ──────────────────────────────────────────────────

class BackupRunCreate(BaseModel):
    backup_job_id: UUID
    started_at: Optional[datetime] = None
    status: str = "pending"
    size_bytes: int = 0
    compression_ratio: float = 0.0
    dedup_ratio: float = 0.0


class BackupRunUpdate(BaseModel):
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    status: Optional[str] = None
    size_bytes: Optional[int] = None
    compression_ratio: Optional[float] = None
    dedup_ratio: Optional[float] = None
    error_message: Optional[str] = None


class BackupRunResponse(BaseModel):
    id: UUID
    backup_job_id: UUID
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    status: str
    size_bytes: int
    compression_ratio: float
    dedup_ratio: float
    error_message: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BackupRunList(BaseModel):
    items: list[BackupRunResponse]
    total: int


# ── RestoreJob ─────────────────────────────────────────────────

class RestoreJobCreate(BaseModel):
    backup_run_id: UUID
    target_path: Optional[str] = None
    verify_checksum: bool = True


class RestoreJobUpdate(BaseModel):
    target_path: Optional[str] = None
    status: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    verify_checksum: Optional[bool] = None


class RestoreJobResponse(BaseModel):
    id: UUID
    backup_run_id: UUID
    target_path: Optional[str]
    status: str
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    verify_checksum: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RestoreJobList(BaseModel):
    items: list[RestoreJobResponse]
    total: int
