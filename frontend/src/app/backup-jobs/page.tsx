"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listBackupJobs, createBackupJob, deleteBackupJob, runBackupJob } from "@/lib/api";
import type { BackupJob } from "@/lib/api";

const statusColor: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
};

export default function BackupJobsPage() {
  const [jobs, setJobs] = useState<BackupJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    source_type: "database",
    source_config: "",
    schedule_cron: "0 2 * * *",
    retention_days: 30,
    compression_enabled: true,
    encryption_enabled: true,
  });

  async function load() {
    setLoading(true);
    const data = await listBackupJobs();
    setJobs(data.items);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createBackupJob({
      ...form,
      description: null,
      status: "active",
      storage_target_id: null,
    });
    setOpen(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this backup job?")) return;
    await deleteBackupJob(id);
    load();
  }

  async function handleRun(id: string) {
    await runBackupJob(id);
    alert("Backup run triggered!");
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Backup Jobs</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={() => setOpen(true)}>Create Job</Button>
          <DialogContent>
            <DialogHeader><DialogTitle>New Backup Job</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <Label>Source Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={form.source_type}
                  onChange={(e) => setForm({ ...form, source_type: e.target.value })}
                >
                  <option value="database">Database</option>
                  <option value="filesystem">Filesystem</option>
                  <option value="s3">S3</option>
                  <option value="vm">VM</option>
                </select>
              </div>
              <div>
                <Label>Source Config (JSON)</Label>
                <Input value={form.source_config} onChange={(e) => setForm({ ...form, source_config: e.target.value })} />
              </div>
              <div>
                <Label>Schedule (cron)</Label>
                <Input value={form.schedule_cron} onChange={(e) => setForm({ ...form, schedule_cron: e.target.value })} />
              </div>
              <div>
                <Label>Retention (days)</Label>
                <Input type="number" value={form.retention_days} onChange={(e) => setForm({ ...form, retention_days: Number(e.target.value) })} />
              </div>
              <Button type="submit" className="w-full">Create</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Retention</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : jobs.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No backup jobs yet</TableCell></TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">
                      <a href={`/backup-jobs/${job.id}`} className="hover:underline">{job.name}</a>
                    </TableCell>
                    <TableCell>{job.source_type}</TableCell>
                    <TableCell>{job.schedule_cron}</TableCell>
                    <TableCell>{job.retention_days} days</TableCell>
                    <TableCell>
                      <Badge className={statusColor[job.status] || "bg-gray-100 text-gray-800"}>{job.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleRun(job.id)}>Run</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(job.id)}>Delete</Button>
                    </TableCell>
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
