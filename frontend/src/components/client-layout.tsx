"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

function Sidebar() {
  const pathname = usePathname() ?? "";
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "🛡️" },
    { href: "/backup-jobs", label: "Backup Jobs", icon: "💾" },
    { href: "/backup-runs", label: "Backup Runs", icon: "⏱️" },
    { href: "/restore-jobs", label: "Restore Jobs", icon: "🔄" },
    { href: "/storage-targets", label: "Storage Targets", icon: "☁️" },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
      <div className="p-6 border-b border-slate-700">
        <Link href="/" className="block">
          <h1 className="text-xl font-bold tracking-tight">DClaw Backup</h1>
          <p className="text-xs text-slate-400 mt-1">AI-Native Protection</p>
        </Link>
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

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isAppPage =
    pathname === "/dashboard" ||
    pathname.startsWith("/backup-") ||
    pathname.startsWith("/restore-") ||
    pathname.startsWith("/storage-");

  if (!isAppPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-gray-50/50 p-6">{children}</main>
    </div>
  );
}
