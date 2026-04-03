'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getEntry, getEntries, JournalEntry } from '@/lib/entries';
import { ArrowLeft, Calendar as CalendarIcon, Clock, History, Hash } from 'lucide-react';



function formatDate(timestamp: { seconds: number }) {
  if (!timestamp?.seconds) return '';
  return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Fallback mock entries if FB fails
const mockEntries = [
  {
    id: '4',
    week: 4,
    title: 'Projects Feature, Ticketing Center, and Code Formatting',
    excerpt: 'This week we focused on finalizing the core HRIS features...',
    content: '<p>This week we focused on finalizing the core HRIS features, primarily adding the projects feature and ticketing center for employee requests. I also spent time setting up code formatting tools.</p><h2>Key Challenges</h2><p>Working with new components took some getting used to. I implemented several new libraries and mapped out our routing patterns.</p><ul><li>Configured Redux store</li><li>Built Tickets UI table</li><li>Resolved legacy formatting bugs</li></ul>',
    createdAt: { seconds: 1710000000 },
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=400'
  },
  {
    id: '3',
    week: 3,
    title: 'Realignment, Timekeeping, Dark Mode Integration',
    excerpt: 'Integrated a fully functional dark mode theme matching the requested aesthetic...',
    content: '<p>Integrated a fully functional dark mode theme matching the requested aesthetic. Also worked on aligning the timekeeping module with the backend API.</p><h2>Dark Mode</h2><p>Used Tailwind CSS to build robust dark mode support across the entire HR dashboard, ensuring high accessibility contrast.</p>',
    createdAt: { seconds: 1709400000 },
    coverImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800&h=400'
  },
  {
    id: '2',
    week: 2,
    title: 'Expanding the HRIS – Auth, Employee Management',
    excerpt: 'Vastly expanded the HRIS platform by wiring up the authentication service...',
    content: '<p>Vastly expanded the HRIS platform by wiring up the authentication service and building the interactive tables for the employee management dashboard.</p><h2>Features Added</h2><p>Built out role-based authentication flows and fully guarded React routes. Designed the full employees-list data grid.</p>',
    createdAt: { seconds: 1708700000 }
  },
  {
    id: '1',
    week: 1,
    title: 'Orientation & Kicking Off the Quanby HRIS',
    excerpt: 'First week at Quanby. Went through onboarding...',
    content: '<p>First week at Quanby. Went through onboarding, met the team, and got started setting up the Next.js boilerplate for the new HRIS system.</p><h2>Initial Setup</h2><p>Installed Next.js, configured Tailwind, and set up our global folder structure following the repository guidelines.</p>',
    createdAt: { seconds: 1708400000 }
  }
];

export default function EntryPage() {
  const params = useParams();
  const id = params.id as string;
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [allEntries, setAllEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Immediately resolve mock entries to prevent Firebase from hanging
    const foundMock = mockEntries.find(m => m.id === id);
    if (foundMock) {
      setEntry(foundMock as any);
      setAllEntries(mockEntries as any);
      setLoading(false);
      return;
    }

    Promise.all([getEntry(id), getEntries()])
      .then(([e, all]) => {
        setEntry(e);
        setAllEntries(all);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] pb-20">
        <nav className="border-b border-[#30363d] bg-[#161b22] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <img src="/images/profile.png" alt="Logo" className="w-8 h-8 rounded-full border border-[#30363d] object-cover" />
            <span className="font-semibold text-white tracking-wide">Quanby OJT Blog</span>
          </div>
        </nav>
        <div className="max-w-[900px] mx-auto px-4 md:px-8 mt-10 animate-pulse">
          <div className="h-6 w-32 bg-[#21262d] rounded-md mb-8" />
          <div className="h-10 w-3/4 bg-[#21262d] rounded-md mb-6" />
          <div className="h-[300px] w-full bg-[#21262d] rounded-xl mb-12" />
          <div className="space-y-4">
            <div className="h-4 w-full bg-[#21262d] rounded-md" />
            <div className="h-4 w-full bg-[#21262d] rounded-md" />
            <div className="h-4 w-5/6 bg-[#21262d] rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col items-center justify-center p-6">
        <img src="/images/profile.png" alt="Logo" className="w-16 h-16 rounded-full border border-[#30363d] object-cover mb-6" />
        <h2 className="text-2xl font-light text-white mb-2">404: Entry not found</h2>
        <p className="text-[#8b949e] mb-8 text-center max-w-sm">
          This journal entry doesn't exist, has been removed, or you don't have access to it.
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

  // Find prev/next
  const currentIndex = allEntries.findIndex((e) => e.id === id);
  const prevEntry = currentIndex < allEntries.length - 1 ? allEntries[currentIndex + 1] : null;
  const nextEntry = currentIndex > 0 ? allEntries[currentIndex - 1] : null;

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-[#1f6feb] selection:text-white pb-24">
      {/* Top Navbar */}
      <nav className="border-b border-[#30363d] bg-[#161b22] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          <img src="/images/profile.png" alt="Logo" className="w-8 h-8 rounded-full border border-[#30363d] object-cover" />
          <span className="font-semibold text-white tracking-wide truncate max-w-[150px] sm:max-w-none">Quanby OJT Blog</span>
        </Link>
        <div>
          <a href="/admin" className="text-sm font-semibold border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-md transition-colors flex items-center gap-2">
            Admin Panel
          </a>
        </div>
      </nav>

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
          {/* GitHub Header Style */}
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
                <span className="font-semibold text-[#c9d1d9] hover:text-[#58a6ff] hover:underline cursor-pointer">
                  jDxve <span className="mx-1 text-[#30363d]">•</span> <span className="text-[#8b949e] font-normal">Bachelor of Science in Information Technology</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4" />
                {formatDate(entry.createdAt as unknown as { seconds: number })}
              </div>
              <div className="flex items-center gap-1.5">
                <History className="w-4 h-4" />
                Authored this report
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 md:pt-10">
            {entry.coverImage && (
              <div className="w-full rounded-lg overflow-hidden border border-[#30363d] mb-10 bg-[#21262d]">
                <img
                  src={entry.coverImage}
                  alt={entry.title}
                  className="w-full h-auto max-h-[500px] object-cover"
                />
              </div>
            )}

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
