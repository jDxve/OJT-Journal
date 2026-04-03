'use client';

import Link from 'next/link';
import { GitCommit, Edit2, Trash2, ArrowRight } from 'lucide-react';
import type { JournalEntry } from '@/lib/entries';

interface TimelineEntryProps {
  entry: JournalEntry;
  isAdmin?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetail: (entry: JournalEntry) => void;
}

export default function TimelineEntry({
  entry,
  isAdmin = false,
  onDelete,
  onViewDetail,
}: TimelineEntryProps) {
  return (
    <div className="relative pl-8 md:pl-10 group">
      {/* Timeline Node */}
      <div className="absolute left-[-16px] top-[-4px] w-8 h-8 bg-[#238636] border border-[rgba(240,246,252,0.1)] rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
        <GitCommit className="w-4 h-4 text-white opacity-80" />
      </div>

      {/* Meta Row */}
      <div className="flex items-center mb-4 text-sm text-[#8b949e]">
        <div className="flex items-center gap-x-2">
          <img
            src="/images/profile.png"
            className="w-6 h-6 rounded-full border border-[#30363d]"
            alt="avatar"
          />
          <span className="font-semibold text-[#c9d1d9]">jDxve</span>
          <span>uploaded a weekly entry for week-{entry.week}</span>
        </div>
      </div>

      {/* Card */}
      <div 
        onClick={() => onViewDetail(entry)}
        className="border border-[#30363d] bg-[#0d1117] rounded-xl overflow-hidden hover:border-[#8b949e] transition-colors shadow-sm cursor-pointer"
      >
        <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center shrink-0 bg-[#238636] border border-[rgba(240,246,252,0.1)] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full gap-1 shadow-sm">
              # Week {entry.week}
            </span>
            <h3 className="font-semibold text-white group-hover:text-[#58a6ff] transition-colors line-clamp-1">
              {entry.title}
            </h3>
          </div>

          {/* Admin Actions - Integrated in Header */}
          {isAdmin && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
              <Link
                href={`/admin/entry/${entry.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] text-[11px] font-bold text-[#8b949e] hover:text-white transition-all shadow-sm"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(entry.id);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#0d1117] hover:bg-[#da3633]/15 border border-[#30363d] text-[11px] font-bold text-[#8b949e] hover:text-[#ff7b72] transition-all shadow-sm"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 space-y-4">
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
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(entry);
                }}
                className="text-xs font-bold text-[#8b949e] hover:text-white transition-colors flex items-center gap-1"
              >
                View Entry <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
