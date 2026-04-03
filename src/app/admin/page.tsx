'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminAuth from '@/components/AdminAuth';
import { getEntries, deleteEntry, JournalEntry } from '@/lib/entries';
import {
  Trash2,
  Edit2,
  ShieldCheck,
  GraduationCap,
  Star,
  Activity,
  Search,
  BookOpen,
  GitCommit,
  ArrowRight,
} from 'lucide-react';
import CustomBookIcon from '@/components/icons/CustomBookIcon';

function formatDate(timestamp: { seconds: number } | null | undefined) {
  if (!timestamp?.seconds) return '—';
  return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function AdminDashboard() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getEntries()
      .then(setEntries)
      .catch((err) => console.error('Load failed:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteEntry(deleting);
      setEntries((prev) => prev.filter((e) => e.id !== deleting));
    } finally {
      setDeleting(null);
    }
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `week ${entry.week}`.includes(searchQuery.toLowerCase()),
  );

  return (
    <AdminAuth>
      <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-[#1f6feb] selection:text-white pb-20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 pt-12 flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-20">

          {/* Sidebar */}
          <aside className="w-full md:w-[280px] lg:w-[296px] shrink-0 space-y-6 md:sticky md:top-24 self-start">
            <div className="relative">
              <div className="flex flex-row md:flex-col items-center md:items-start gap-5 md:gap-0">
                <div className="w-[100px] h-[100px] md:w-full md:h-auto md:aspect-square shrink-0 rounded-full border border-[#30363d] bg-[#21262d] overflow-hidden mb-0 md:mb-5">
                  <img
                    src="/images/profile.png"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight md:mt-2 truncate md:whitespace-normal">
                    John Dave B. Bañas
                  </h1>
                  <h2 className="text-lg sm:text-xl text-[#8b949e] font-light mb-2 md:mb-5 tracking-wide truncate md:whitespace-normal">
                    jDxve
                  </h2>

                  <div className="flex flex-col gap-1.5 md:gap-3 text-sm text-[#e6edf3] mt-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#8b949e] shrink-0" />
                      <span className="font-medium">
                        Bachelor of Science in Information Technology
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#8b949e] shrink-0" />
                      <span className="font-medium">Quanby OJT Program</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#8b949e] shrink-0" />
                      <span className="text-[#8b949e]">System:</span>
                      <span className="font-semibold text-[#58a6ff]">Payroll Management</span>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-[#30363d] my-6 md:my-8" />

              {/* OJT Progress */}
              <div className="space-y-3 pb-2">
                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#3fb950]" />
                  OJT Journal Progress
                </h3>

                <div className="space-y-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[#8b949e]">Timeline</span>
                    <span className="font-medium text-white">
                      {entries.length} of 8 weeks logged
                    </span>
                  </div>

                  <div className="w-full bg-[#21262d] rounded-full h-2.5 overflow-hidden shadow-inner border border-[#30363d]/50">
                    <div
                      className="bg-gradient-to-r from-[#2ea043] to-[#3fb950] h-full rounded-full transition-all duration-1000 ease-out relative"
                      style={{ width: `${Math.min((entries.reduce((s, e) => s + (e.totalHours ?? 0), 0) / 320) * 100, 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#8b949e] mt-2 pt-2 border-t border-[#30363d]">
                    <span>0 hrs</span>
                    <span className="text-[#3fb950] font-bold">
                      {entries.reduce((s, e) => s + (e.totalHours ?? 0), 0)} hrs credited
                    </span>
                    <span>320 hrs</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Journal Repository
                </h2>
                <p className="text-sm text-[#8b949e] mt-1">
                  Manage and curate training entries.
                </p>
              </div>
              <Link
                href="/admin/entry"
                className="bg-[#238636] hover:bg-[#2ea043] text-white font-semibold text-sm px-5 py-1.5 rounded-lg transition-all flex items-center justify-center gap-2 border border-[rgba(240,246,252,0.1)] shadow-sm active:scale-95 shrink-0"
              >
                <CustomBookIcon size="16" className="text-white" /> New Entry
              </Link>
            </div>

            {/* Search */}
            <div className="mb-8 relative max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e] group-focus-within:text-[#58a6ff] transition-colors" />
              <input
                type="text"
                placeholder="Filter entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161b22] border border-[#30363d] rounded-md py-2 pl-10 pr-4 text-sm text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
              />
            </div>

            {/* Entry list */}
            <div className="h-[calc(100vh-350px)] overflow-y-auto pr-2">
              {loading ? (
                <div className="space-y-8">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse flex gap-10">
                      <div className="w-1 bg-[#30363d] h-48 rounded" />
                      <div className="flex-1 bg-[#161b22] rounded-xl h-48 border border-[#30363d]" />
                    </div>
                  ))}
                </div>
              ) : filteredEntries.length === 0 ? (
                <div className="py-24 border border-dashed border-[#30363d] rounded-2xl flex flex-col items-center text-center">
                  <ShieldCheck className="w-12 h-12 text-[#21262d] mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">No entries found</h3>
                  <p className="text-sm text-[#8b949e] max-w-sm">
                    {searchQuery
                      ? `No records match "${searchQuery}".`
                      : 'Create your first journal entry to get started.'}
                  </p>
                  {!searchQuery && (
                    <Link
                      href="/admin/entry"
                      className="mt-6 px-5 py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold rounded-md border border-[rgba(240,246,252,0.1)] transition-colors"
                    >
                      Create First Entry
                    </Link>
                  )}
                </div>
              ) : (
                <div className="relative border-l border-[#30363d] ml-3 md:ml-4 space-y-12 pb-20 pt-4">
                  {[...filteredEntries].reverse().map((entry) => (
                    <div key={entry.id} className="relative pl-8 md:pl-10 group">
                      {/* Timeline node */}
                      <div className="absolute left-[-16px] top-4 w-8 h-8 bg-[#238636] border border-[#30363d] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <GitCommit className="w-4 h-4 text-white opacity-80" />
                      </div>

                      {/* Row: meta + actions */}
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3 text-sm text-[#8b949e]">
                          <img
                            src="/images/profile.png"
                            className="w-6 h-6 rounded-full border border-[#30363d]"
                            alt="avatar"
                          />
                          <span className="font-semibold text-[#c9d1d9]">jDxve</span>
                          <span className="hidden sm:inline">
                            uploaded entry for week-{entry.week}
                          </span>
                          <span>· {formatDate(entry.createdAt as any)}</span>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/admin/entry/${entry.id}`}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-all border border-[#30363d] text-xs font-bold"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </Link>
                          <button
                            onClick={() => setDeleting(entry.id)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-[#da3633]/15 text-[#8b949e] hover:text-[#ff7b72] transition-all border border-[#30363d] text-xs font-bold"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>

                      {/* Card */}
                      <div className="border border-[#30363d] bg-[#0d1117] rounded-xl overflow-hidden hover:border-[#8b949e] transition-all shadow-sm">
                        <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] flex items-center gap-3">
                          <span className="shrink-0 bg-[#238636] border border-[#30363d] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            WEEK {entry.week}
                          </span>
                          <h3 className="font-bold text-white group-hover:text-[#58a6ff] transition-colors truncate">
                            {entry.title}
                          </h3>
                        </div>

                        <div className="p-4 md:p-6 grid gap-4">
                          {entry.coverImage && (
                            <div className="w-full h-48 md:h-56 bg-[#21262d] rounded-lg overflow-hidden border border-[#30363d]">
                              <img
                                src={entry.coverImage}
                                alt={entry.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <p className="text-sm text-[#8b949e] leading-relaxed line-clamp-3">
                            {entry.excerpt}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-[#30363d]">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#c9d1d9] bg-[#21262d] px-2 py-1 rounded-md border border-[#30363d] uppercase tracking-wider">
                              <span className="w-2 h-2 rounded-full bg-[#3fb950]" /> Published
                            </span>
                            <Link
                              href={`/admin/entry/${entry.id}`}
                              className="text-xs font-bold text-[#58a6ff] hover:underline flex items-center gap-1"
                            >
                              Edit Entry <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Delete confirmation modal */}
        {deleting && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-xl max-w-[400px] w-full shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#30363d] bg-[#161b22]">
                <h3 className="text-base font-bold text-white">Confirm Deletion</h3>
              </div>
              <div className="p-6">
                <p className="text-sm text-[#8b949e] leading-relaxed mb-6">
                  This will permanently delete the entry from Firestore. This action cannot be
                  undone.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleDelete}
                    className="w-full py-2 bg-[#da3633] hover:bg-[#b62324] text-white font-bold text-sm rounded-md transition-all"
                  >
                    Delete Entry
                  </button>
                  <button
                    onClick={() => setDeleting(null)}
                    className="w-full py-2 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] font-bold text-sm rounded-md border border-[#30363d] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminAuth>
  );
}
