export interface BackupJob {
  id: string;
  source_path: string;
  frequency: string;
  next_run: string;
  estimated_size_gb: number;
  compression_ratio: number;
  status: string;
  created_at: string;
}

export interface BackupRun {
  id: string;
  job_id: string;
  started_at: string;
  completed_at: string;
  status: string;
  size_gb: number;
}

export async function api<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `/api/v1${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  const res = await fetch(url, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}
