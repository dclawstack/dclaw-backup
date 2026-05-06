import random
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class CreateJobRequest(BaseModel):
    source_path: str
    frequency: str


class BackupJob(BaseModel):
    id: str
    source_path: str
    frequency: str
    next_run: str
    estimated_size_gb: float
    compression_ratio: float
    status: str
    created_at: str


class BackupRun(BaseModel):
    id: str
    job_id: str
    started_at: str
    completed_at: str
    status: str
    size_gb: float


@router.post("/jobs")
async def create_job(req: CreateJobRequest) -> BackupJob:
    return BackupJob(
        id=str(uuid.uuid4()),
        source_path=req.source_path,
        frequency=req.frequency,
        next_run="2026-05-08T02:00:00Z",
        estimated_size_gb=round(random.uniform(10, 500), 2),
        compression_ratio=round(random.uniform(0.3, 0.7), 2),
        status="scheduled",
        created_at=datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    )


@router.get("/jobs/{job_id}/history")
async def get_job_history(job_id: str) -> list[BackupRun]:
    now = datetime.now(timezone.utc)
    return [
        BackupRun(
            id=str(uuid.uuid4()),
            job_id=job_id,
            started_at=(now.replace(hour=now.hour - 3)).isoformat().replace("+00:00", "Z"),
            completed_at=(now.replace(hour=now.hour - 2)).isoformat().replace("+00:00", "Z"),
            status="success",
            size_gb=round(random.uniform(10, 500), 2),
        ),
        BackupRun(
            id=str(uuid.uuid4()),
            job_id=job_id,
            started_at=(now.replace(hour=now.hour - 6)).isoformat().replace("+00:00", "Z"),
            completed_at=(now.replace(hour=now.hour - 5)).isoformat().replace("+00:00", "Z"),
            status="success",
            size_gb=round(random.uniform(10, 500), 2),
        ),
        BackupRun(
            id=str(uuid.uuid4()),
            job_id=job_id,
            started_at=(now.replace(hour=now.hour - 9)).isoformat().replace("+00:00", "Z"),
            completed_at=(now.replace(hour=now.hour - 8)).isoformat().replace("+00:00", "Z"),
            status="success",
            size_gb=round(random.uniform(10, 500), 2),
        ),
    ]
