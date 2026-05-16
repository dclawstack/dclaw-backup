"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listBackupRuns } from "@/lib/api";
import type { BackupRun } from "@/lib/api";

function formatSize(bytes: number) {
  const gb = bytes / 1024 / 1024 / 1024;
  return `${gb.toFixed(2)} GB`;
}

const statusColor: Record<string, string> = {
  success: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  running: "bg-blue-100 text-blue-800",
  pending: "bg-gray-100 text-gray-800",
};

export default function BackupRunsPage() {
  const [runs, setRuns] = useState<BackupRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listBackupRuns().then((data) => { setRuns(data.items); setLoading(false); });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Backup Runs</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Compression</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Error</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : runs.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">No backup runs yet</TableCell></TableRow>
              ) : (
                runs.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="font-mono text-xs">{run.backup_job_id.slice(0, 8)}</TableCell>
                    <TableCell><Badge className={statusColor[run.status] || "bg-gray-100 text-gray-800"}>{run.status}</Badge></TableCell>
                    <TableCell>{formatSize(run.size_bytes)}</TableCell>
                    <TableCell>{(run.compression_ratio * 100).toFixed(0)}%</TableCell>
                    <TableCell>{run.started_at ? new Date(run.started_at).toLocaleString() : "—"}</TableCell>
                    <TableCell>{run.completed_at ? new Date(run.completed_at).toLocaleString() : "—"}</TableCell>
                    <TableCell className="text-red-600 text-xs">{run.error_message || "—"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
