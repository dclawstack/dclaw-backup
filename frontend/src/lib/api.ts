const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });
  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(`API error ${response.status}: ${error}`, response.status);
  }
  return response.json();
}

export async function getHealth() {
  return fetchJson<{ status: string }>("/health/");
}

// ── Storage Targets ──────────────────────────────────────────────

export interface StorageTarget {
  id: string;
  name: string;
  target_type: string;
  config?: string | null;
  region?: string | null;
  immutable_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface StorageTargetList {
  items: StorageTarget[];
  total: number;
}

export async function listStorageTargets(): Promise<StorageTargetList> {
  return fetchJson("/api/v1/storage-targets");
}

export async function createStorageTarget(data: Omit<StorageTarget, "id" | "created_at" | "updated_at">): Promise<StorageTarget> {
  return fetchJson("/api/v1/storage-targets", { method: "POST", body: JSON.stringify(data) });
}

export async function updateStorageTarget(id: string, data: Partial<StorageTarget>): Promise<StorageTarget> {
  return fetchJson(`/api/v1/storage-targets/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteStorageTarget(id: string): Promise<void> {
  await fetchJson(`/api/v1/storage-targets/${id}`, { method: "DELETE" });
}

// ── Backup Jobs ──────────────────────────────────────────────────

export interface BackupJob {
  id: string;
  name: string;
  description?: string | null;
  source_type: string;
  source_config?: string | null;
  schedule_cron?: string | null;
  retention_days: number;
  compression_enabled: boolean;
  encryption_enabled: boolean;
  status: string;
  storage_target_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackupJobList {
  items: BackupJob[];
  total: number;
}

export async function listBackupJobs(): Promise<BackupJobList> {
  return fetchJson("/api/v1/backup-jobs");
}

export async function createBackupJob(data: Omit<BackupJob, "id" | "created_at" | "updated_at">): Promise<BackupJob> {
  return fetchJson("/api/v1/backup-jobs", { method: "POST", body: JSON.stringify(data) });
}

export async function getBackupJob(id: string): Promise<BackupJob & { sources: any[]; runs: any[] }> {
  return fetchJson(`/api/v1/backup-jobs/${id}`);
}

export async function updateBackupJob(id: string, data: Partial<BackupJob>): Promise<BackupJob> {
  return fetchJson(`/api/v1/backup-jobs/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteBackupJob(id: string): Promise<void> {
  await fetchJson(`/api/v1/backup-jobs/${id}`, { method: "DELETE" });
}

export async function runBackupJob(id: string): Promise<BackupRun> {
  return fetchJson(`/api/v1/backup/jobs/${id}/run`, { method: "POST" });
}

// ── Backup Runs ──────────────────────────────────────────────────

export interface BackupRun {
  id: string;
  backup_job_id: string;
  started_at?: string | null;
  completed_at?: string | null;
  status: string;
  size_bytes: number;
  compression_ratio: number;
  dedup_ratio: number;
  error_message?: string | null;
  created_at: string;
}

export interface BackupRunList {
  items: BackupRun[];
  total: number;
}

export async function listBackupRuns(jobId?: string): Promise<BackupRunList> {
  const qs = jobId ? `?job_id=${jobId}` : "";
  return fetchJson(`/api/v1/backup-runs${qs}`);
}

export async function createBackupRun(data: Omit<BackupRun, "id" | "created_at">): Promise<BackupRun> {
  return fetchJson("/api/v1/backup-runs", { method: "POST", body: JSON.stringify(data) });
}

export async function updateBackupRun(id: string, data: Partial<BackupRun>): Promise<BackupRun> {
  return fetchJson(`/api/v1/backup-runs/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

// ── Restore Jobs ─────────────────────────────────────────────────

export interface RestoreJob {
  id: string;
  backup_run_id: string;
  target_path?: string | null;
  status: string;
  started_at?: string | null;
  completed_at?: string | null;
  verify_checksum: boolean;
  created_at: string;
  updated_at: string;
}

export interface RestoreJobList {
  items: RestoreJob[];
  total: number;
}

export async function listRestoreJobs(): Promise<RestoreJobList> {
  return fetchJson("/api/v1/restore-jobs");
}

export async function createRestoreJob(data: Omit<RestoreJob, "id" | "created_at" | "updated_at">): Promise<RestoreJob> {
  return fetchJson("/api/v1/restore-jobs", { method: "POST", body: JSON.stringify(data) });
}

// ── Dashboard ────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<{
  total_jobs: number;
  total_runs: number;
  total_restores: number;
  total_targets: number;
  success_rate: number;
  total_storage_gb: number;
}> {
  // Aggregate client-side from existing endpoints for now
  const jobs = await listBackupJobs();
  const runs = await listBackupRuns();
  const restores = await listRestoreJobs();
  const targets = await listStorageTargets();

  const totalRuns = runs.total;
  const successfulRuns = runs.items.filter((r) => r.status === "success").length;
  const successRate = totalRuns > 0 ? Math.round((successfulRuns / totalRuns) * 100) : 0;
  const totalBytes = runs.items.reduce((sum, r) => sum + r.size_bytes, 0);

  return {
    total_jobs: jobs.total,
    total_runs: totalRuns,
    total_restores: restores.total,
    total_targets: targets.total,
    success_rate: successRate,
    total_storage_gb: Math.round((totalBytes / 1024 / 1024 / 1024) * 100) / 100,
  };
}

export { ApiError };
export const api = fetchJson;
