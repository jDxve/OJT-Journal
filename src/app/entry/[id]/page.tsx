'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getEntry, getEntries, JournalEntry } from '@/lib/entries';
import { ArrowLeft, Calendar as CalendarIcon, History, Hash, Clock } from 'lucide-react';
import ImageCarousel from '@/components/ImageCarousel';

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
  const prevEntry = currentIndex < allEntries.length - 1 ? allEntries[currentIndex + 1] : null;
  const nextEntry = currentIndex > 0 ? allEntries[currentIndex - 1] : null;

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

        <article className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#161b22] px-6 py-5 border-b border-[#30363d]">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center bg-[#238636] border border-[rgba(240,246,252,0.1)] text-white text-sm font-semibold px-2.5 py-1 rounded-full gap-1.5 shadow-sm">
                <Hash className="w-4 h-4 opacity-70" /> Week {entry.week}
              </span>
              <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider bg-[#21262d] border border-[#30363d] px-2 py-1 rounded-md">
                Published
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-semibold text-white mb-4 tracking-tight leading-tight">
              {entry.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#8b949e]">
              <div className="flex items-center gap-2">
                <img
                  src="/images/profile.png"
                  alt="Avatar"
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="font-semibold text-[#c9d1d9]">
                  jDxve{' '}
                  <span className="mx-1 text-[#30363d]">•</span>{' '}
                  <span className="text-[#8b949e] font-normal">
                    Bachelor of Science in Information Technology
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4" />
                {entry.dateRange?.label ?? formatDate(entry.createdAt as unknown as { seconds: number })}
              </div>
              {entry.totalHours ? (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {entry.totalHours}h logged
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <History className="w-4 h-4" />
                  Authored this report
                </div>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8 md:pt-10">
            <ImageCarousel images={carouselImages} alt={entry.title} />

            <div
              className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:text-white prose-a:text-[#58a6ff] hover:prose-a:underline prose-img:rounded-md prose-img:border prose-img:border-[#30363d] prose-hr:border-[#30363d] prose-blockquote:border-l-4 prose-blockquote:border-[#30363d] prose-blockquote:text-[#8b949e] leading-relaxed text-[#c9d1d9]"
              dangerouslySetInnerHTML={{ __html: entry.content }}
            />
          </div>
        </article>

        {/* Prev / Next Navigation */}
        {(prevEntry || nextEntry) && (
          <nav className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-[#30363d]">
            {prevEntry ? (
              <Link
                href={`/entry/${prevEntry.id}`}
                className="flex-1 flex flex-col items-start p-4 bg-[#0d1117] hover:bg-[#161b22] border border-[#30363d] hover:border-[#8b949e] rounded-xl transition-all group"
              >
                <div className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2 flex items-center gap-1.5 group-hover:text-[#c9d1d9] transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Previous Week
                </div>
                <div className="text-white font-medium group-hover:text-[#58a6ff] transition-colors line-clamp-1">
                  {prevEntry.title}
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {nextEntry ? (
              <Link
                href={`/entry/${nextEntry.id}`}
                className="flex-1 flex flex-col items-end text-right p-4 bg-[#0d1117] hover:bg-[#161b22] border border-[#30363d] hover:border-[#8b949e] rounded-xl transition-all group"
              >
                <div className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2 flex items-center gap-1.5 group-hover:text-[#c9d1d9] transition-colors">
                  Next Week <ArrowLeft className="w-4 h-4 rotate-180" />
                </div>
                <div className="text-white font-medium group-hover:text-[#58a6ff] transition-colors line-clamp-1">
                  {nextEntry.title}
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </nav>
        )}
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
