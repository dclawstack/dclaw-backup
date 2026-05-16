import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function FeatureCard({
  icon,
  title,
  description,
  badge,
}: {
  icon: string;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <Card className="border border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          {badge && (
            <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
        {number}
      </div>
      <div>
        <h4 className="font-semibold text-slate-900 mb-1">{title}</h4>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <span className="font-bold text-slate-900 tracking-tight">
              DClaw Backup
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
              How it Works
            </a>
            <a href="#security" className="hover:text-slate-900 transition-colors">
              Security
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20">
              v1.3 — Now with AI Copilot
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              AI-Native Backup
              <br />
              <span className="text-indigo-400">for Modern Teams</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl leading-relaxed">
              Protect your data with intelligent backup automation. Immutable
              storage, ransomware detection, and cross-cloud resilience — all
              guided by an AI that speaks your language.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-indigo-500 hover:bg-indigo-600 text-white px-8">
                  Launch App →
                </Button>
              </Link>
              <a href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-8"
                >
                  Explore Features
                </Button>
              </a>
            </div>
          </div>

          {/* Hero visual — bento-style feature cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-900/60 border-slate-700/50 text-white">
              <CardContent className="p-5">
                <div className="text-3xl font-bold text-indigo-400 mb-1">99.9%</div>
                <div className="text-sm text-slate-400">Backup success rate</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/60 border-slate-700/50 text-white">
              <CardContent className="p-5">
                <div className="text-3xl font-bold text-emerald-400 mb-1">WORM</div>
                <div className="text-sm text-slate-400">Immutable by default</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/60 border-slate-700/50 text-white">
              <CardContent className="p-5">
                <div className="text-3xl font-bold text-amber-400 mb-1">AI</div>
                <div className="text-sm text-slate-400">Recovery copilot</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Everything you need to protect your data
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              From immutable storage to AI-guided recovery, DClaw Backup gives
              enterprise-grade protection without enterprise-grade complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon="☁️"
              title="Multi-Cloud Storage"
              description="Connect AWS S3, Azure Blob, Google Cloud Storage, SFTP, or local targets. Replicate across providers for true resilience."
            />
            <FeatureCard
              icon="🔒"
              title="Immutable Backups"
              description="Write-once-read-many (WORM) storage with configurable retention. Ransomware can't touch what it can't overwrite."
              badge="Security"
            />
            <FeatureCard
              icon="🤖"
              title="AI Recovery Copilot"
              description="Ask questions in plain English. 'Restore yesterday's database to staging at 3pm.' The AI handles the rest."
              badge="AI"
            />
            <FeatureCard
              icon="⚡"
              title="Incremental & Deduplicated"
              description="Block-level deduplication and compression reduce storage costs by up to 70%. Only changed bytes are transferred."
            />
            <FeatureCard
              icon="🛡️"
              title="Ransomware Detection"
              description="Real-time entropy analysis detects encryption patterns in backup streams. Alert before the damage spreads."
              badge="Security"
            />
            <FeatureCard
              icon="📋"
              title="Compliance & Audit Trails"
              description="GFS retention policies, legal holds, and immutable audit logs. Meet SOC 2, HIPAA, and GDPR requirements."
            />
            <FeatureCard
              icon="⏱️"
              title="Point-in-Time Recovery"
              description="Browse backup timelines and restore to any second. One-click full or selective recovery with checksum verification."
            />
            <FeatureCard
              icon="🔁"
              title="Cross-Cloud Replication"
              description="Automatically replicate backups across AWS → Azure → GCP. No vendor lock-in, maximum availability."
            />
            <FeatureCard
              icon="🧪"
              title="Automated Restore Testing"
              description="Schedule automated restore-to-sandbox validations. Know your backups work before you need them."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Backups that just work
              </h2>
              <p className="text-slate-600 mb-10">
                Set up your protection strategy in minutes, not days. Our
                intelligent engine handles the complexity so you can focus on
                building.
              </p>
              <div className="space-y-8">
                <Step
                  number="1"
                  title="Configure Sources & Targets"
                  description="Connect your databases, filesystems, VMs, or cloud resources. Add S3, Azure Blob, GCS, or local storage targets with a few clicks."
                />
                <Step
                  number="2"
                  title="Schedule & Protect"
                  description="Set cron schedules, retention policies, and immutability. Compression and deduplication happen automatically."
                />
                <Step
                  number="3"
                  title="Recover with Confidence"
                  description="Browse your backup timeline, chat with the AI copilot, and restore with one click — verified by automated testing."
                />
              </div>
            </div>

            <div className="bg-slate-950 rounded-2xl p-8 text-white shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs text-slate-500 font-mono">
                  dclaw-backup --status
                </span>
              </div>
              <pre className="text-sm font-mono text-slate-300 leading-relaxed overflow-x-auto">
                <code>{`$ dclaw backup status

┌─────────────────────────────────────────┐
│  DClaw Backup — System Status          │
├─────────────────────────────────────────┤
│  Jobs:        12 active                │
│  Last Run:    2 minutes ago ✅          │
│  Success:     99.7% (last 30 days)     │
│  Storage:     4.2 TB (compressed)      │
│  Savings:     68% via deduplication    │
│  Immutable:   ✅ WORM enabled           │
│  AI Copilot:  🟢 Online               │
│  Threats:     0 alerts                 │
└─────────────────────────────────────────┘

$ dclaw backup chat
💬 "Restore the postgres backup from 
    yesterday to staging-db at 3pm"

🤖 AI Copilot: Restoring backup 
   run #8f3a2 to staging-db...
   ✅ Verified. 2.3 GB restored in 47s.`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">
              Security-first, compliance-ready
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Built for teams that can't afford to lose data — or trust.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="text-2xl mb-3">🔐</div>
              <h3 className="font-semibold mb-2">Encryption at Rest & Transit</h3>
              <p className="text-sm text-slate-400">
                AES-256 encryption for stored backups. TLS 1.3 for all data in
                transit. Keys managed via your preferred KMS.
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="text-2xl mb-3">🧬</div>
              <h3 className="font-semibold mb-2">Ransomware Detection</h3>
              <p className="text-sm text-slate-400">
                Entropy analysis and extension-change monitoring on every backup
                stream. Alerts within seconds of suspicious activity.
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="text-2xl mb-3">📜</div>
              <h3 className="font-semibold mb-2">Immutable Audit Trail</h3>
              <p className="text-sm text-slate-400">
                Every action logged to tamper-proof storage. Compliance reports
                for SOC 2, HIPAA, GDPR, and PCI-DSS generated on demand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to protect what matters?
          </h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
            Deploy DClaw Backup in minutes with Docker. No credit card, no
            sales calls — just working backups.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-white text-indigo-700 hover:bg-slate-100 px-8 font-semibold"
              >
                Launch Dashboard →
              </Button>
            </Link>
            <a
              href="https://github.com/dclawstack/dclaw-backup"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8"
              >
                View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-12 border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🛡️</span>
                <span className="font-bold text-white tracking-tight">
                  DClaw Backup
                </span>
              </div>
              <p className="text-sm max-w-xs">
                AI-native immutable backup platform for modern development
                teams.
              </p>
            </div>
            <div className="flex gap-12 text-sm">
              <div>
                <h4 className="font-semibold text-white mb-3">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#features" className="hover:text-white transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#how-it-works" className="hover:text-white transition-colors">
                      How it Works
                    </a>
                  </li>
                  <li>
                    <Link href="/dashboard" className="hover:text-white transition-colors">
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      API Reference
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Docker Deploy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-slate-900 text-xs text-slate-600 flex flex-col md:flex-row justify-between items-center gap-2">
            <p>© 2026 DClaw Stack. All rights reserved.</p>
            <p>Built with FastAPI · SQLAlchemy 2.0 · Next.js 14 · PostgreSQL</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
