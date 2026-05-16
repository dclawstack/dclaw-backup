"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listRestoreJobs, createRestoreJob, listBackupRuns } from "@/lib/api";
import type { RestoreJob } from "@/lib/api";

const statusColor: Record<string, string> = {
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  running: "bg-blue-100 text-blue-800",
  pending: "bg-gray-100 text-gray-800",
};

export default function RestoreJobsPage() {
  const [restores, setRestores] = useState<RestoreJob[]>([]);
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ backup_run_id: "", target_path: "/restore" });

  async function load() {
    setLoading(true);
    const [r, j] = await Promise.all([listRestoreJobs(), listBackupRuns()]);
    setRestores(r.items);
    setRuns(j.items);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createRestoreJob({
      backup_run_id: form.backup_run_id,
      target_path: form.target_path,
      status: "pending",
      verify_checksum: true,
    });
    setOpen(false);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Restore Jobs</h2>
        <Button onClick={() => setOpen(true)}>New Restore</Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Restore Job</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label>Backup Run</Label>
                <select
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  value={form.backup_run_id}
                  onChange={(e) => setForm({ ...form, backup_run_id: e.target.value })}
                  required
                >
                  <option value="">Select run...</option>
                  {runs.map((r) => (
                    <option key={r.id} value={r.id}>{r.status} — {new Date(r.created_at).toLocaleString()}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Target Path</Label>
                <Input value={form.target_path} onChange={(e) => setForm({ ...form, target_path: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full">Create Restore Job</Button>
            </form>
          </DialogContent>
        </Dialog>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Run ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Verify Checksum</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : restores.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No restore jobs yet</TableCell></TableRow>
              ) : (
                restores.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.backup_run_id.slice(0, 8)}</TableCell>
                    <TableCell><Badge className={statusColor[item.status] || "bg-gray-100 text-gray-800"}>{item.status}</Badge></TableCell>
                    <TableCell>{item.target_path || "—"}</TableCell>
                    <TableCell>{item.verify_checksum ? "Yes" : "No"}</TableCell>
                    <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
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
