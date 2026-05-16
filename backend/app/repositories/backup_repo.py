from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.repositories.base_repo import BaseRepository
from app.models.backup import StorageTarget, BackupJob, BackupSource, BackupRun, RestoreJob


class StorageTargetRepository(BaseRepository[StorageTarget]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, StorageTarget)


class BackupJobRepository(BaseRepository[BackupJob]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, BackupJob)


class BackupSourceRepository(BaseRepository[BackupSource]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, BackupSource)

    async def list_by_job(self, job_id: UUID, limit: int = 100, offset: int = 0):
        result = await self.db.execute(
            select(BackupSource)
            .where(BackupSource.backup_job_id == job_id)
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())


class BackupRunRepository(BaseRepository[BackupRun]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, BackupRun)

    async def list_by_job(self, job_id: UUID, limit: int = 100, offset: int = 0):
        from sqlalchemy import desc
        result = await self.db.execute(
            select(BackupRun)
            .where(BackupRun.backup_job_id == job_id)
            .order_by(desc(BackupRun.created_at))
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())


class RestoreJobRepository(BaseRepository[RestoreJob]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, RestoreJob)

    async def list_by_run(self, run_id: UUID, limit: int = 100, offset: int = 0):
        result = await self.db.execute(
            select(RestoreJob)
            .where(RestoreJob.backup_run_id == run_id)
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())
