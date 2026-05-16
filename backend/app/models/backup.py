import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import ForeignKey, String, Text, Float, Boolean, Integer, BigInteger, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.core.utils import utc_now


class StorageTarget(Base):
    __tablename__ = "storage_targets"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    target_type: Mapped[str] = mapped_column(String(50), nullable=False)
    config: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    region: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    immutable_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(default=utc_now, onupdate=utc_now)

    backup_jobs: Mapped[list["BackupJob"]] = relationship(
        "BackupJob",
        back_populates="storage_target",
        lazy="selectin",
    )


class BackupJob(Base):
    __tablename__ = "backup_jobs"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    source_type: Mapped[str] = mapped_column(String(50), nullable=False)
    source_config: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    schedule_cron: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    retention_days: Mapped[int] = mapped_column(Integer, default=30)
    compression_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    encryption_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    status: Mapped[str] = mapped_column(String(50), default="active")
    storage_target_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("storage_targets.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(default=utc_now, onupdate=utc_now)

    storage_target: Mapped[Optional["StorageTarget"]] = relationship(
        "StorageTarget",
        back_populates="backup_jobs",
        lazy="selectin",
    )
    sources: Mapped[list["BackupSource"]] = relationship(
        "BackupSource",
        back_populates="backup_job",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
    runs: Mapped[list["BackupRun"]] = relationship(
        "BackupRun",
        back_populates="backup_job",
        lazy="selectin",
        cascade="all, delete-orphan",
    )


class BackupSource(Base):
    __tablename__ = "backup_sources"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    backup_job_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("backup_jobs.id", ondelete="CASCADE"), nullable=False
    )
    source_type: Mapped[str] = mapped_column(String(50), nullable=False)
    connection_string: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    credentials_ref: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    metadata_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=utc_now)

    backup_job: Mapped["BackupJob"] = relationship(
        "BackupJob",
        back_populates="sources",
        lazy="selectin",
    )


class BackupRun(Base):
    __tablename__ = "backup_runs"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    backup_job_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("backup_jobs.id", ondelete="CASCADE"), nullable=False
    )
    started_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="pending")
    size_bytes: Mapped[int] = mapped_column(BigInteger, default=0)
    compression_ratio: Mapped[float] = mapped_column(Float, default=0.0)
    dedup_ratio: Mapped[float] = mapped_column(Float, default=0.0)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=utc_now)

    backup_job: Mapped["BackupJob"] = relationship(
        "BackupJob",
        back_populates="runs",
        lazy="selectin",
    )
    restore_jobs: Mapped[list["RestoreJob"]] = relationship(
        "RestoreJob",
        back_populates="backup_run",
        lazy="selectin",
        cascade="all, delete-orphan",
    )


class RestoreJob(Base):
    __tablename__ = "restore_jobs"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    backup_run_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("backup_runs.id", ondelete="CASCADE"), nullable=False
    )
    target_path: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="pending")
    started_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    verify_checksum: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(default=utc_now, onupdate=utc_now)

    backup_run: Mapped["BackupRun"] = relationship(
        "BackupRun",
        back_populates="restore_jobs",
        lazy="selectin",
    )
