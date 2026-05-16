from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import init_db
from app.api.routes import health
from app.api.v1 import (
    storage_targets_router,
    backup_jobs_router,
    backup_runs_router,
    restore_jobs_router,
    backup_actions_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(storage_targets_router, prefix="/api/v1/storage-targets", tags=["storage-targets"])
app.include_router(backup_jobs_router, prefix="/api/v1/backup-jobs", tags=["backup-jobs"])
app.include_router(backup_runs_router, prefix="/api/v1/backup-runs", tags=["backup-runs"])
app.include_router(restore_jobs_router, prefix="/api/v1/restore-jobs", tags=["restore-jobs"])
app.include_router(backup_actions_router, prefix="/api/v1/backup", tags=["backup-actions"])
