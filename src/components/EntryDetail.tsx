'use client';

import { JournalEntry } from '@/lib/entries';
import { ArrowLeft, Calendar as CalendarIcon, History, Hash, Clock, ChevronRight } from 'lucide-react';
import ImageCarousel from '@/components/ImageCarousel';
import Link from 'next/link';

interface NavEntry {
  id: string;
  title: string;
}

interface EntryDetailProps {
  entry: Partial<JournalEntry>;
  prevEntry?: NavEntry | null;
  nextEntry?: NavEntry | null;
  onNavigate?: (id: string) => void;
  onClose?: () => void;
}

function formatDate(timestamp: { seconds: number } | null | undefined) {
  if (!timestamp?.seconds) return '';
  return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function EntryDetail({
  entry,
  prevEntry,
  nextEntry,
  onNavigate,
  onClose,
}: EntryDetailProps) {
  const carouselImages =
    entry.images?.length ? entry.images : entry.coverImage ? [entry.coverImage] : [];

  return (
    <article className="bg-[#0d1117] text-[#c9d1d9] font-sans">
      {/* Header */}
      <div className="bg-[#161b22] px-6 py-5 border-b border-t border-[#30363d]">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center justify-center bg-[#238636] border border-[rgba(240,246,252,0.1)] text-white text-xs font-semibold px-2 py-0.5 rounded-full gap-1 shadow-sm">
              <Hash className="w-3.5 h-3.5 opacity-70" /> Week {entry.week}
            </span>
            <span className="text-[10px] font-semibold text-[#8b949e] uppercase tracking-wider bg-[#21262d] border border-[#30363d] px-1.5 py-0.5 rounded-md">
              Published
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-semibold text-white mb-4 tracking-tight leading-tight">
            {entry.title || 'Untitled Entry'}
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
                <span className="text-[#8b949e] font-normal hidden sm:inline">
                  BSIT
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" />
              {entry.dateRange?.label ?? formatDate(entry.createdAt as any)}
            </div>
            {entry.totalHours ? (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {entry.totalHours}h logged
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <History className="w-4 h-4" />
                Report
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="mb-8">
          <ImageCarousel images={carouselImages} alt={entry.title || 'Entry image'} />
        </div>

        <div
          className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:text-white prose-a:text-[#58a6ff] hover:prose-a:underline prose-img:rounded-md prose-img:border prose-img:border-[#30363d] prose-hr:border-[#30363d] prose-blockquote:border-l-4 prose-blockquote:border-[#30363d] prose-blockquote:text-[#8b949e] leading-relaxed text-[#c9d1d9]"
          dangerouslySetInnerHTML={{ __html: entry.content || '' }}
        />

        {/* Prev / Next Navigation */}
        {(prevEntry || nextEntry) && (
          <nav className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-[#30363d]">
            {prevEntry ? (
              <button
                onClick={() => onNavigate?.(prevEntry.id)}
                className="flex-1 flex flex-col items-start p-4 bg-[#0d1117] hover:bg-[#161b22] border border-[#30363d] hover:border-[#8b949e] rounded-xl transition-all group text-left"
              >
                <div className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2 flex items-center gap-1.5 group-hover:text-[#c9d1d9] transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Previous Week
                </div>
                <div className="text-white font-medium group-hover:text-[#58a6ff] transition-colors line-clamp-1">
                  {prevEntry.title}
                </div>
              </button>
            ) : (
              <div className="flex-1" />
            )}

            {nextEntry ? (
              <button
                onClick={() => onNavigate?.(nextEntry.id)}
                className="flex-1 flex flex-col items-end text-right p-4 bg-[#0d1117] hover:bg-[#161b22] border border-[#30363d] hover:border-[#8b949e] rounded-xl transition-all group"
              >
                <div className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2 flex items-center gap-1.5 group-hover:text-[#c9d1d9] transition-colors">
                  Next Week <ArrowLeft className="w-4 h-4 rotate-180" />
                </div>
                <div className="text-white font-medium group-hover:text-[#58a6ff] transition-colors line-clamp-1">
                  {nextEntry.title}
                </div>
              </button>
            ) : (
              <div className="flex-1" />
            )}
          </nav>
        )}
      </div>
    </article>
  );
}
