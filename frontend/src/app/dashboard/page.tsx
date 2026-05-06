"use client";

import React, { useState } from "react";
import { Database, Plus } from "lucide-react";
import { api, BackupJob } from "@/lib/api";

export default function DashboardPage() {
  const [sourcePath, setSourcePath] = useState("");
  const [frequency, setFrequency] = useState<"hourly" | "daily" | "weekly">("daily");
  const [job, setJob] = useState<BackupJob | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api<BackupJob>("/jobs", {
        method: "POST",
        body: JSON.stringify({ source_path: sourcePath, frequency }),
      });
      setJob(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white px-6 py-4 flex items-center gap-3">
        <Database className="h-6 w-6" style={{ color: "#84CC16" }} />
        <h1 className="text-xl font-bold" style={{ color: "#84CC16" }}>
          DClaw Backup
        </h1>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-10">
        <h2 className="mb-6 text-2xl font-semibold text-slate-800">Dashboard</h2>

        <form onSubmit={handleCreate} className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4">
            <label htmlFor="source" className="mb-1 block text-sm font-medium text-slate-700">
              Source path
            </label>
            <input
              id="source"
              type="text"
              value={sourcePath}
              onChange={(e) => setSourcePath(e.target.value)}
              placeholder="/data/backups"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#84CC16] focus:ring-1 focus:ring-[#84CC16]"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="frequency" className="mb-1 block text-sm font-medium text-slate-700">
              Frequency
            </label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as "hourly" | "daily" | "weekly")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#84CC16] focus:ring-1 focus:ring-[#84CC16]"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#84CC16" }}
          >
            <Plus className="h-4 w-4" />
            {loading ? "Creating..." : "Create Backup Job"}
          </button>
        </form>

        {job && (
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">Backup Job Created</h3>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Job ID</dt>
                <dd className="mt-1 text-sm font-mono text-slate-900">{job.id}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Next run</dt>
                <dd className="mt-1 text-sm text-slate-900">{job.next_run}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Estimated size</dt>
                <dd className="mt-1 text-sm text-slate-900">{job.estimated_size_gb} GB</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Compression ratio</dt>
                <dd className="mt-1 text-sm text-slate-900">{job.compression_ratio.toFixed(2)}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Status</dt>
                <dd className="mt-1 text-sm text-slate-900 capitalize">{job.status}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Created at</dt>
                <dd className="mt-1 text-sm text-slate-900">{job.created_at}</dd>
              </div>
            </dl>
          </div>
        )}
      </section>
    </main>
  );
}
