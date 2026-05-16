"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "🛡️" },
  { href: "/backup-jobs", label: "Backup Jobs", icon: "💾" },
  { href: "/backup-runs", label: "Backup Runs", icon: "⏱️" },
  { href: "/restore-jobs", label: "Restore Jobs", icon: "🔄" },
  { href: "/storage-targets", label: "Storage Targets", icon: "☁️" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold tracking-tight">DClaw Backup</h1>
        <p className="text-xs text-slate-400 mt-1">AI-Native Protection</p>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                active ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-6 border-t border-slate-700">
        <p className="text-xs text-slate-500">v1.3.0-alpha</p>
      </div>
    </aside>
  );
}
