from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.backup_repo import RestoreJobRepository
from app.models.backup import RestoreJob
from app.schemas.backup import (
    RestoreJobCreate,
    RestoreJobUpdate,
    RestoreJobResponse,
    RestoreJobList,
)

router = APIRouter()


def get_repo(db: AsyncSession = Depends(get_db)) -> RestoreJobRepository:
    return RestoreJobRepository(db)


@router.post("", response_model=RestoreJobResponse, status_code=201)
async def create_restore(
    data: RestoreJobCreate,
    repo: RestoreJobRepository = Depends(get_repo),
):
    obj = RestoreJob(**data.model_dump())
    return await repo.create(obj)


@router.get("", response_model=RestoreJobList)
async def list_restores(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    run_id: UUID | None = Query(None),
    repo: RestoreJobRepository = Depends(get_repo),
):
    if run_id:
        items = await repo.list_by_run(run_id, limit=limit, offset=offset)
        total = len(items)
    else:
        items, total = await repo.list_all(limit=limit, offset=offset)
    return RestoreJobList(
        items=[RestoreJobResponse.model_validate(i) for i in items],
        total=total,
    )


@router.get("/{restore_id}", response_model=RestoreJobResponse)
async def get_restore(
    restore_id: UUID,
    repo: RestoreJobRepository = Depends(get_repo),
):
    obj = await repo.get_by_id(restore_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Restore job not found")
    return obj


@router.put("/{restore_id}", response_model=RestoreJobResponse)
async def update_restore(
    restore_id: UUID,
    data: RestoreJobUpdate,
    repo: RestoreJobRepository = Depends(get_repo),
):
    obj = await repo.get_by_id(restore_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Restore job not found")
    await repo.update(obj, **data.model_dump(exclude_unset=True))
    return obj


@router.delete("/{restore_id}", status_code=204)
async def delete_restore(
    restore_id: UUID,
    repo: RestoreJobRepository = Depends(get_repo),
):
    obj = await repo.get_by_id(restore_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Restore job not found")
    await repo.delete(obj)
