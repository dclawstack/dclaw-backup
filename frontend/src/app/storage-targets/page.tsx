"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listStorageTargets, createStorageTarget, deleteStorageTarget } from "@/lib/api";
import type { StorageTarget } from "@/lib/api";

export default function StorageTargetsPage() {
  const [targets, setTargets] = useState<StorageTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", target_type: "s3", region: "", config: "", immutable_enabled: false });

  async function load() {
    setLoading(true);
    const data = await listStorageTargets();
    setTargets(data.items);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createStorageTarget(form);
    setOpen(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this storage target?")) return;
    await deleteStorageTarget(id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Storage Targets</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={() => setOpen(true)}>Add Target</Button>
          <DialogContent>
            <DialogHeader><DialogTitle>New Storage Target</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <Label>Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={form.target_type}
                  onChange={(e) => setForm({ ...form, target_type: e.target.value })}
                >
                  <option value="s3">AWS S3</option>
                  <option value="azure_blob">Azure Blob</option>
                  <option value="gcs">Google Cloud Storage</option>
                  <option value="local">Local</option>
                  <option value="sftp">SFTP</option>
                </select>
              </div>
              <div>
                <Label>Region</Label>
                <Input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
              </div>
              <div>
                <Label>Config (JSON)</Label>
                <Input value={form.config} onChange={(e) => setForm({ ...form, config: e.target.value })} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.immutable_enabled} onChange={(e) => setForm({ ...form, immutable_enabled: e.target.checked })} />
                <Label>Immutable (WORM)</Label>
              </div>
              <Button type="submit" className="w-full">Create Target</Button>
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
                <TableHead>Type</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Immutable</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : targets.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No storage targets yet</TableCell></TableRow>
              ) : (
                targets.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>{t.target_type}</TableCell>
                    <TableCell>{t.region || "—"}</TableCell>
                    <TableCell>
                      <Badge className={t.immutable_enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {t.immutable_enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(t.id)}>Delete</Button>
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
