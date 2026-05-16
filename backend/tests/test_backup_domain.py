import pytest
from httpx import AsyncClient

from app.schemas.backup import (
    StorageTargetCreate,
    BackupJobCreate,
    BackupRunCreate,
    RestoreJobCreate,
)


# ── Storage Targets ────────────────────────────────────────────

@pytest.mark.asyncio
async def test_create_storage_target(client: AsyncClient):
    payload = {"name": "S3 Primary", "target_type": "s3", "region": "us-east-1"}
    response = await client.post("/api/v1/storage-targets", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "S3 Primary"
    assert data["target_type"] == "s3"
    assert data["immutable_enabled"] is False


@pytest.mark.asyncio
async def test_list_storage_targets(client: AsyncClient):
    await client.post("/api/v1/storage-targets", json={
        "name": "Azure", "target_type": "azure_blob"
    })
    response = await client.get("/api/v1/storage-targets")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert len(data["items"]) >= 1


@pytest.mark.asyncio
async def test_get_storage_target(client: AsyncClient):
    create_resp = await client.post("/api/v1/storage-targets", json={
        "name": "GCS", "target_type": "gcs"
    })
    target_id = create_resp.json()["id"]
    response = await client.get(f"/api/v1/storage-targets/{target_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "GCS"


@pytest.mark.asyncio
async def test_update_storage_target(client: AsyncClient):
    create_resp = await client.post("/api/v1/storage-targets", json={
        "name": "Old Name", "target_type": "local"
    })
    target_id = create_resp.json()["id"]
    response = await client.put(f"/api/v1/storage-targets/{target_id}", json={
        "name": "New Name"
    })
    assert response.status_code == 200
    assert response.json()["name"] == "New Name"


@pytest.mark.asyncio
async def test_delete_storage_target(client: AsyncClient):
    create_resp = await client.post("/api/v1/storage-targets", json={
        "name": "To Delete", "target_type": "sftp"
    })
    target_id = create_resp.json()["id"]
    response = await client.delete(f"/api/v1/storage-targets/{target_id}")
    assert response.status_code == 204
    get_resp = await client.get(f"/api/v1/storage-targets/{target_id}")
    assert get_resp.status_code == 404


# ── Backup Jobs ────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_create_backup_job(client: AsyncClient):
    payload = {
        "name": "Daily DB Backup",
        "source_type": "database",
        "source_config": "postgresql://localhost:5432/mydb",
        "schedule_cron": "0 2 * * *",
        "retention_days": 30,
    }
    response = await client.post("/api/v1/backup-jobs", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Daily DB Backup"
    assert data["status"] == "active"
    assert data["compression_enabled"] is True


@pytest.mark.asyncio
async def test_list_backup_jobs(client: AsyncClient):
    await client.post("/api/v1/backup-jobs", json={
        "name": "Files Backup", "source_type": "filesystem"
    })
    response = await client.get("/api/v1/backup-jobs")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1


@pytest.mark.asyncio
async def test_get_backup_job(client: AsyncClient):
    create_resp = await client.post("/api/v1/backup-jobs", json={
        "name": "VM Backup", "source_type": "vm"
    })
    job_id = create_resp.json()["id"]
    response = await client.get(f"/api/v1/backup-jobs/{job_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "VM Backup"


@pytest.mark.asyncio
async def test_update_backup_job(client: AsyncClient):
    create_resp = await client.post("/api/v1/backup-jobs", json={
        "name": "Old Job", "source_type": "s3"
    })
    job_id = create_resp.json()["id"]
    response = await client.put(f"/api/v1/backup-jobs/{job_id}", json={
        "name": "Updated Job", "retention_days": 90
    })
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Job"
    assert data["retention_days"] == 90


@pytest.mark.asyncio
async def test_delete_backup_job(client: AsyncClient):
    create_resp = await client.post("/api/v1/backup-jobs", json={
        "name": "Delete Me", "source_type": "database"
    })
    job_id = create_resp.json()["id"]
    response = await client.delete(f"/api/v1/backup-jobs/{job_id}")
    assert response.status_code == 204
    get_resp = await client.get(f"/api/v1/backup-jobs/{job_id}")
    assert get_resp.status_code == 404


# ── Backup Runs ────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_create_backup_run(client: AsyncClient):
    job_resp = await client.post("/api/v1/backup-jobs", json={
        "name": "Run Test Job", "source_type": "database"
    })
    job_id = job_resp.json()["id"]
    payload = {
        "backup_job_id": str(job_id),
        "status": "pending",
        "size_bytes": 1073741824,
    }
    response = await client.post("/api/v1/backup-runs", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "pending"
    assert data["backup_job_id"] == str(job_id)


@pytest.mark.asyncio
async def test_list_backup_runs_by_job(client: AsyncClient):
    job_resp = await client.post("/api/v1/backup-jobs", json={
        "name": "Run List Job", "source_type": "database"
    })
    job_id = job_resp.json()["id"]
    await client.post("/api/v1/backup-runs", json={
        "backup_job_id": str(job_id), "status": "success"
    })
    response = await client.get(f"/api/v1/backup-runs?job_id={job_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1


@pytest.mark.asyncio
async def test_update_backup_run(client: AsyncClient):
    job_resp = await client.post("/api/v1/backup-jobs", json={
        "name": "Run Update Job", "source_type": "database"
    })
    job_id = job_resp.json()["id"]
    run_resp = await client.post("/api/v1/backup-runs", json={
        "backup_job_id": str(job_id), "status": "running"
    })
    run_id = run_resp.json()["id"]
    response = await client.put(f"/api/v1/backup-runs/{run_id}", json={
        "status": "success", "compression_ratio": 0.45
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["compression_ratio"] == 0.45


# ── Restore Jobs ───────────────────────────────────────────────

@pytest.mark.asyncio
async def test_create_restore_job(client: AsyncClient):
    job_resp = await client.post("/api/v1/backup-jobs", json={
        "name": "Restore Test Job", "source_type": "database"
    })
    job_id = job_resp.json()["id"]
    run_resp = await client.post("/api/v1/backup-runs", json={
        "backup_job_id": str(job_id), "status": "success"
    })
    run_id = run_resp.json()["id"]
    payload = {
        "backup_run_id": str(run_id),
        "target_path": "/restore/staging",
    }
    response = await client.post("/api/v1/restore-jobs", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["backup_run_id"] == str(run_id)
    assert data["status"] == "pending"
    assert data["verify_checksum"] is True


@pytest.mark.asyncio
async def test_list_restore_jobs(client: AsyncClient):
    job_resp = await client.post("/api/v1/backup-jobs", json={
        "name": "Restore List Job", "source_type": "database"
    })
    job_id = job_resp.json()["id"]
    run_resp = await client.post("/api/v1/backup-runs", json={
        "backup_job_id": str(job_id), "status": "success"
    })
    run_id = run_resp.json()["id"]
    await client.post("/api/v1/restore-jobs", json={
        "backup_run_id": str(run_id), "target_path": "/tmp"
    })
    response = await client.get("/api/v1/restore-jobs")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1


# ── Backup Actions ─────────────────────────────────────────────

@pytest.mark.asyncio
async def test_run_backup_job_action(client: AsyncClient):
    job_resp = await client.post("/api/v1/backup-jobs", json={
        "name": "Action Job", "source_type": "database"
    })
    job_id = job_resp.json()["id"]
    response = await client.post(f"/api/v1/backup/jobs/{job_id}/run")
    assert response.status_code == 201
    data = response.json()
    assert data["backup_job_id"] == str(job_id)
    assert data["status"] in ["success", "failed"]
    assert data["size_bytes"] > 0
