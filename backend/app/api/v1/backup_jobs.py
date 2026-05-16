from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.backup_repo import BackupJobRepository
from app.models.backup import BackupJob
from app.schemas.backup import (
    BackupJobCreate,
    BackupJobUpdate,
    BackupJobResponse,
    BackupJobDetailResponse,
    BackupJobList,
)

router = APIRouter()


def get_repo(db: AsyncSession = Depends(get_db)) -> BackupJobRepository:
    return BackupJobRepository(db)


@router.post("", response_model=BackupJobResponse, status_code=201)
async def create_job(
    data: BackupJobCreate,
    repo: BackupJobRepository = Depends(get_repo),
):
    obj = BackupJob(**data.model_dump())
    return await repo.create(obj)


@router.get("", response_model=BackupJobList)
async def list_jobs(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    repo: BackupJobRepository = Depends(get_repo),
):
    items, total = await repo.list_all(limit=limit, offset=offset)
    return BackupJobList(
        items=[BackupJobResponse.model_validate(i) for i in items],
        total=total,
    )


@router.get("/{job_id}", response_model=BackupJobDetailResponse)
async def get_job(
    job_id: UUID,
    repo: BackupJobRepository = Depends(get_repo),
):
    obj = await repo.get_by_id(job_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Backup job not found")
    return obj


@router.put("/{job_id}", response_model=BackupJobResponse)
async def update_job(
    job_id: UUID,
    data: BackupJobUpdate,
    repo: BackupJobRepository = Depends(get_repo),
):
    obj = await repo.get_by_id(job_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Backup job not found")
    await repo.update(obj, **data.model_dump(exclude_unset=True))
    return obj


@router.delete("/{job_id}", status_code=204)
async def delete_job(
    job_id: UUID,
    repo: BackupJobRepository = Depends(get_repo),
):
    obj = await repo.get_by_id(job_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Backup job not found")
    await repo.delete(obj)
