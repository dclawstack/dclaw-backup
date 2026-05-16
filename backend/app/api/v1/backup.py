import random
import uuid
from app.core.utils import utc_now

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.backup_repo import BackupJobRepository, BackupRunRepository
from app.models.backup import BackupRun
from app.schemas.backup import BackupRunResponse

router = APIRouter()


@router.post("/jobs/{job_id}/run", response_model=BackupRunResponse, status_code=201)
async def run_backup_job(
    job_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    job_repo = BackupJobRepository(db)
    run_repo = BackupRunRepository(db)

    job = await job_repo.get_by_id(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Backup job not found")

    size_mb = random.randint(100, 50000)
    compression = round(random.uniform(0.2, 0.6), 2)
    dedup = round(random.uniform(0.1, 0.4), 2)

    run = BackupRun(
        backup_job_id=job_id,
        started_at=utc_now(),
        status="running",
        size_bytes=size_mb * 1024 * 1024,
        compression_ratio=compression,
        dedup_ratio=dedup,
    )
    await run_repo.create(run)

    # Simulate completion immediately for demo
    run.status = random.choice(["success", "success", "success", "failed"])
    run.completed_at = utc_now()
    if run.status == "failed":
        run.error_message = random.choice([
            "Connection timeout to source",
            "Insufficient storage on target",
            "Checksum mismatch detected",
        ])
    await db.commit()
    await db.refresh(run)

    return run


@router.post("/runs/{run_id}/restore", response_model=BackupRunResponse)
async def restore_from_run(
    run_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    run_repo = BackupRunRepository(db)
    run = await run_repo.get_by_id(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Backup run not found")
    return run
