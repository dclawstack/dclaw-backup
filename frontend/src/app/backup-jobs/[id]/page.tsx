"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBackupJob, runBackupJob } from "@/lib/api";

function formatSize(bytes: number) {
  const gb = bytes / 1024 / 1024 / 1024;
  return `${gb.toFixed(2)} GB`;
}

export default function BackupJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getBackupJob(id)
      .then(setJob)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleRun() {
    if (!id) return;
    await runBackupJob(id);
    alert("Backup run triggered!");
    const refreshed = await getBackupJob(id);
    setJob(refreshed);
  }

  if (loading) return <p>Loading job...</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{job.name}</h2>
          <p className="text-gray-500">{job.source_type} • {job.schedule_cron}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRun}>Run Now</Button>
          <Link href="/backup-jobs" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">Back</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Status</CardTitle></CardHeader><CardContent><Badge>{job.status}</Badge></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Compression</CardTitle></CardHeader><CardContent><span className="font-medium">{job.compression_enabled ? "Enabled" : "Disabled"}</span></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Encryption</CardTitle></CardHeader><CardContent><span className="font-medium">{job.encryption_enabled ? "Enabled" : "Disabled"}</span></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Retention</CardTitle></CardHeader><CardContent><span className="font-medium">{job.retention_days} days</span></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Created</CardTitle></CardHeader><CardContent><span className="font-medium">{new Date(job.created_at).toLocaleDateString()}</span></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Runs</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Compression</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {job.runs?.length > 0 ? job.runs.slice(0, 10).map((run: any) => (
                <TableRow key={run.id}>
                  <TableCell><Badge className={run.status === "success" ? "bg-green-100 text-green-800" : run.status === "failed" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}>{run.status}</Badge></TableCell>
                  <TableCell>{formatSize(run.size_bytes)}</TableCell>
                  <TableCell>{(run.compression_ratio * 100).toFixed(0)}%</TableCell>
                  <TableCell>{run.started_at ? new Date(run.started_at).toLocaleString() : "—"}</TableCell>
                  <TableCell>{run.completed_at ? new Date(run.completed_at).toLocaleString() : "—"}</TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={5} className="text-center py-6 text-gray-500">No runs yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
