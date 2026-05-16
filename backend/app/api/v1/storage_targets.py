from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.backup_repo import StorageTargetRepository
from app.models.backup import StorageTarget
from app.schemas.backup import (
    StorageTargetCreate,
    StorageTargetUpdate,
    StorageTargetResponse,
    StorageTargetList,
)

router = APIRouter()


def get_repo(db: AsyncSession = Depends(get_db)) -> StorageTargetRepository:
    return StorageTargetRepository(db)


@router.post("", response_model=StorageTargetResponse, status_code=201)
async def create_target(
    data: StorageTargetCreate,
    repo: StorageTargetRepository = Depends(get_repo),
):
    obj = StorageTarget(**data.model_dump())
    return await repo.create(obj)


@router.get("", response_model=StorageTargetList)
async def list_targets(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    repo: StorageTargetRepository = Depends(get_repo),
):
    items, total = await repo.list_all(limit=limit, offset=offset)
    return StorageTargetList(
        items=[StorageTargetResponse.model_validate(i) for i in items],
        total=total,
    )


@router.get("/{target_id}", response_model=StorageTargetResponse)
async def get_target(
    target_id: UUID,
    repo: StorageTargetRepository = Depends(get_repo),
):
    obj = await repo.get_by_id(target_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Storage target not found")
    return obj


@router.put("/{target_id}", response_model=StorageTargetResponse)
async def update_target(
    target_id: UUID,
    data: StorageTargetUpdate,
    repo: StorageTargetRepository = Depends(get_repo),
):
    obj = await repo.get_by_id(target_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Storage target not found")
    await repo.update(obj, **data.model_dump(exclude_unset=True))
    return obj


@router.delete("/{target_id}", status_code=204)
async def delete_target(
    target_id: UUID,
    repo: StorageTargetRepository = Depends(get_repo),
):
    obj = await repo.get_by_id(target_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Storage target not found")
    await repo.delete(obj)
