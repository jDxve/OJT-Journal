"use client";

import { useState, useEffect, Suspense } from "react";
import {
  ArrowRight,
  BookOpen,
  Star,
  Activity,
  GitCommit,
  GraduationCap,
  Search,
  Loader2,
} from "lucide-react";
import { getEntries, JournalEntry } from "@/lib/entries";
import SidePanel from "@/components/SidePanel";
import EntryDetail from "@/components/EntryDetail";
import TimelineEntry from "@/components/TimelineEntry";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

function formatDate(timestamp: { seconds: number } | null | undefined) {
  if (!timestamp?.seconds) return "—";
  return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#30363d] animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const entryId = searchParams.get('entry');
    if (entryId && entries.length > 0) {
      const entry = entries.find(e => e.id === entryId);
      if (entry) {
        setSelectedEntry(entry);
        setIsPanelOpen(true);
      }
    }
  }, [searchParams, entries]);

  const openEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsPanelOpen(true);
    const params = new URLSearchParams(searchParams);
    params.set('entry', entry.id);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const closeEntry = () => {
    setIsPanelOpen(false);
    const params = new URLSearchParams(searchParams);
    params.delete('entry');
    router.push(pathname, { scroll: false });
  };

  useEffect(() => {
    getEntries()
      .then(setEntries)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredEntries = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `week ${entry.week}`.includes(searchQuery.toLowerCase()) ||
      String(entry.week) === searchQuery.trim(),
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-[#1f6feb] selection:text-white pb-20">
      {/* Top Navbar */}
      <nav className="border-b border-[#30363d] bg-[#161b22] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <img
            src="/images/profile.png"
            alt="Logo"
            className="w-8 h-8 rounded-full border border-[#30363d] object-cover"
          />
          <span className="font-semibold text-white tracking-wide truncate max-w-[150px] sm:max-w-none">
            Quanby OJT Blog
          </span>
          <div className="hidden md:flex ml-6 gap-4 text-sm font-medium">
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" /> Entries
            </button>
          </div>
        </div>
        <div>
          <a
            href="/admin"
            className="text-sm font-semibold border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-md transition-colors flex items-center gap-2"
          >
            <LockIcon className="w-4 h-4" /> Admin Panel
          </a>
        </div>
      </nav>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pt-12 flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-20">
        {/* Left Sidebar */}
        <aside className="w-full md:w-[280px] lg:w-[296px] shrink-0 space-y-6 md:sticky md:top-24 self-start pb-8">
          <div className="relative">
            <div className="flex flex-row md:flex-col items-center md:items-start gap-5 md:gap-0">
              <div className="w-[100px] h-[100px] md:w-full md:h-auto md:aspect-square shrink-0 rounded-full border border-[#30363d] bg-[#21262d] overflow-hidden mb-0 md:mb-5">
                <img
                  src="/images/profile.png"
                  alt="Profile"
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight md:mt-2 truncate md:whitespace-normal">
                  John Dave B. Bañas
                </h1>
                <h2 className="text-lg sm:text-xl text-[#8b949e] font-light mb-2 md:mb-5 tracking-wide truncate md:whitespace-normal">
                  jDxve
                </h2>

                <div className="flex flex-col gap-1.5 md:gap-3 text-sm text-[#c9d1d9] mt-2 md:mt-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#8b949e] shrink-0" />
                    <span className="font-medium whitespace-nowrap truncate min-w-0">
                      Bachelor of Science in Information Technology
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#8b949e] shrink-0" />
                    <span className="font-medium truncate">Quanby OJT Program</span>
                  </div>
                  <div className="flex items-center gap-2 line-clamp-1">
                    <BookOpen className="w-4 h-4 text-[#8b949e] shrink-0" />
                    <span className="text-[#8b949e] shrink-0">System:</span>
                    <span className="font-semibold text-[#58a6ff] truncate">
                      Payroll Management
                    </span>
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

              <div className="space-y-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#8b949e]">Timeline</span>
                  <span className="font-medium text-white">
                    {entries.length} of 8 weeks logged
                  </span>
                </div>

                <div className="w-full bg-[#21262d] rounded-full h-2.5 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-[#2ea043] to-[#3fb950] h-full rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${Math.min((entries.reduce((s, e) => s + (e.totalHours ?? 0), 0) / 486) * 100, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-white/10 rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#8b949e] mt-2 pt-2 border-t border-[#30363d]">
                  <span className="text-[#3fb950] font-semibold">
                    {entries.reduce((s, e) => s + (e.totalHours ?? 0), 0)} hrs credited
                  </span>
                  <span>486 hrs</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Feed Column Wrapper */}
        <div className="flex-1 min-w-0 relative">
          <main className="w-full">
              {/* Title and Search Header Area */}
              <div className="pt-2 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    My Weekly Journal
                  </h1>
                  <p className="text-[#8b949e] text-lg mt-1">
                    A comprehensive timeline of my On the Job Training.
                  </p>
                </div>

                {/* Search Bar on the Right */}
                <div className="relative w-full max-w-[480px] group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e] group-focus-within:text-[#58a6ff] transition-colors" />
                  <input
                    type="text"
                    placeholder="Search entries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#161b22] border border-[#30363d] rounded-lg h-10 pl-10 pr-4 text-white placeholder-[#484f58] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-[#30363d] animate-spin" />
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="py-24 border border-dashed border-[#30363d] rounded-2xl flex flex-col items-center text-center">
              <BookOpen className="w-10 h-10 text-[#21262d] mb-4" />
              <h3 className="text-white font-semibold mb-1">
                {searchQuery ? "No entries match your search" : "No entries yet"}
              </h3>
              <p className="text-sm text-[#8b949e]">
                {searchQuery
                  ? "Try a different keyword."
                  : "Check back soon for weekly updates."}
              </p>
            </div>
          ) : (
            <div className="relative border-l border-[#30363d] ml-3 md:ml-4 space-y-10 pt-4 pb-8">
              {filteredEntries.map((entry) => (
                <TimelineEntry
                  key={entry.id}
                  entry={entry}
                  isAdmin={false}
                  onViewDetail={(e) => openEntry(e)}
                />
              ))}
            </div>
          )}
          </main>
          
          <SidePanel
            isOpen={isPanelOpen}
            onClose={closeEntry}
            title={selectedEntry?.title}
            mode="absolute"
          >
            {selectedEntry && (
              <EntryDetail
                entry={selectedEntry}
                prevEntry={(() => {
                  const idx = entries.findIndex((e) => e.id === selectedEntry.id);
                  return idx > 0 ? { id: entries[idx - 1].id, title: entries[idx - 1].title } : null;
                })()}
                nextEntry={(() => {
                  const idx = entries.findIndex((e) => e.id === selectedEntry.id);
                  return idx < entries.length - 1
                    ? { id: entries[idx + 1].id, title: entries[idx + 1].title }
                    : null;
                })()}
                onNavigate={(id) => {
                  const entry = entries.find((e) => e.id === id);
                  if (entry) openEntry(entry);
                }}
                onClose={closeEntry}
              />
            )}
          </SidePanel>
        </div>
      </div>
    </div>
  );
}

function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
