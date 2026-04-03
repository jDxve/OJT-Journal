'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getEntry, getEntries, JournalEntry } from '@/lib/entries';
import { ArrowLeft, Calendar as CalendarIcon, History, Hash, Clock } from 'lucide-react';
import EntryDetail from '@/components/EntryDetail';

function formatDate(timestamp: { seconds: number } | null | undefined) {
  if (!timestamp?.seconds) return '';
  return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function EntryPage() {
  const params = useParams();
  const id = params.id as string;
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [allEntries, setAllEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([getEntry(id), getEntries()])
      .then(([e, all]) => {
        if (!e) {
          setNotFound(true);
        } else {
          setEntry(e);
          setAllEntries(all);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
        <Navbar />
        <div className="max-w-[900px] mx-auto px-4 md:px-8 mt-10 animate-pulse">
          <div className="h-6 w-32 bg-[#21262d] rounded-md mb-8" />
          <div className="h-10 w-3/4 bg-[#21262d] rounded-md mb-6" />
          <div className="h-[300px] w-full bg-[#21262d] rounded-xl mb-12" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-[#21262d] rounded-md" />
            <div className="h-4 w-full bg-[#21262d] rounded-md" />
            <div className="h-4 w-5/6 bg-[#21262d] rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !entry) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col items-center justify-center p-6">
        <img
          src="/images/profile.png"
          alt="Logo"
          className="w-16 h-16 rounded-full border border-[#30363d] object-cover mb-6"
        />
        <h2 className="text-2xl font-light text-white mb-2">404 · Entry not found</h2>
        <p className="text-[#8b949e] mb-8 text-center max-w-sm text-sm">
          This journal entry doesn't exist or has been removed.
        </p>
        <Link
          href="/"
          className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] px-4 py-2 rounded-md font-medium text-sm transition-colors"
        >
          Return to home
        </Link>
      </div>
    );
  }

  const currentIndex = allEntries.findIndex((e) => e.id === id);
  const prevEntry = currentIndex > 0 ? allEntries[currentIndex - 1] : null;
  const nextEntry = currentIndex < allEntries.length - 1 ? allEntries[currentIndex + 1] : null;

  const carouselImages =
    entry.images?.length ? entry.images : entry.coverImage ? [entry.coverImage] : [];

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-[#1f6feb] selection:text-white pb-24">
      <Navbar />

      <main className="max-w-[900px] mx-auto px-4 md:px-8 mt-8 md:mt-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#58a6ff] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>
        </div>

        <EntryDetail
          entry={entry}
          prevEntry={prevEntry ? { id: prevEntry.id, title: prevEntry.title } : null}
          nextEntry={nextEntry ? { id: nextEntry.id, title: nextEntry.title } : null}
          onNavigate={(id) => {
            window.location.href = `/entry/${id}`;
          }}
        />
      </main>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="border-b border-[#30363d] bg-[#161b22] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
        <img
          src="/images/profile.png"
          alt="Logo"
          className="w-8 h-8 rounded-full border border-[#30363d] object-cover"
        />
        <span className="font-semibold text-white tracking-wide truncate max-w-[150px] sm:max-w-none">
          Quanby OJT Blog
        </span>
      </Link>
      <a
        href="/admin"
        className="text-sm font-semibold border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-md transition-colors"
      >
        Admin Panel
      </a>
    </nav>
  );
}
