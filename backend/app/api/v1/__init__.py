from app.api.v1.storage_targets import router as storage_targets_router
from app.api.v1.backup_jobs import router as backup_jobs_router
from app.api.v1.backup_runs import router as backup_runs_router
from app.api.v1.restore_jobs import router as restore_jobs_router
from app.api.v1.backup import router as backup_actions_router

__all__ = [
    "storage_targets_router",
    "backup_jobs_router",
    "backup_runs_router",
    "restore_jobs_router",
    "backup_actions_router",
]
