from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.backup_repo import BackupRunRepository
from app.models.backup import BackupRun
from app.schemas.backup import (
    BackupRunCreate,
    BackupRunUpdate,
    BackupRunResponse,
    BackupRunList,
)

router = APIRouter()


def get_repo(db: AsyncSession = Depends(get_db)) -> BackupRunRepository:
    return BackupRunRepository(db)


@router.post("", response_model=BackupRunResponse, status_code=201)
async def create_run(
    data: BackupRunCreate,
    repo: BackupRunRepository = Depends(get_repo),
):
    obj = BackupRun(**data.model_dump())
    return await repo.create(obj)


@router.get("", response_model=BackupRunList)
async def list_runs(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    job_id: UUID | None = Query(None),
    repo: BackupRunRepository = Depends(get_repo),
):
    if job_id:
        items = await repo.list_by_job(job_id, limit=limit, offset=offset)
        total = len(items)  # simplified; ideally count query
    else:
        items, total = await repo.list_all(limit=limit, offset=offset)
    return BackupRunList(
        items=[BackupRunResponse.model_validate(i) for i in items],
        total=total,
    )


@router.get("/{run_id}", response_model=BackupRunResponse)
async def get_run(
    run_id: UUID,
    repo: BackupRunRepository = Depends(get_repo),
):
    obj = await repo.get_by_id(run_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Backup run not found")
    return obj


@router.put("/{run_id}", response_model=BackupRunResponse)
async def update_run(
    run_id: UUID,
    data: BackupRunUpdate,
    repo: BackupRunRepository = Depends(get_repo),
):
    obj = await repo.get_by_id(run_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Backup run not found")
    await repo.update(obj, **data.model_dump(exclude_unset=True))
    return obj


@router.delete("/{run_id}", status_code=204)
async def delete_run(
    run_id: UUID,
    repo: BackupRunRepository = Depends(get_repo),
):
    obj = await repo.get_by_id(run_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Backup run not found")
    await repo.delete(obj)
