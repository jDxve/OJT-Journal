'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminAuth from '@/components/AdminAuth';
import TiptapEditor from '@/components/TiptapEditor';
import ImageUpload from '@/components/ImageUpload';
import { createEntry } from '@/lib/entries';
import { ArrowLeft, Save, ShieldCheck, Settings, BookOpen, Calendar, Info } from 'lucide-react';

export default function CreateEntryPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [week, setWeek] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !week) return;

    setSaving(true);
    try {
      await createEntry({
        title: title.trim(),
        week: parseInt(week, 10),
        content,
        coverImage,
        excerpt: excerpt.trim() || title.trim(),
      });
      router.push('/admin');
    } catch (err) {
      console.error('Create failed:', err);
      setSaving(false);
    }
  };

  return (
    <AdminAuth>
      <div className="min-h-screen bg-[#0d1117] pb-24">
        {/* Sub-header / Breadcrumbs */}
        <div className="border-b border-[#30363d] bg-[#161b22]/50 backdrop-blur-md sticky top-[65px] z-30">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <Link href="/admin" className="text-[#8b949e] hover:text-[#58a6ff] transition-colors shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="h-4 w-[1px] bg-[#30363d] mx-1 shrink-0" />
              <div className="flex items-center gap-2 text-sm font-medium overflow-hidden">
                <span className="text-[#8b949e] truncate">Admin</span>
                <span className="text-[#30363d]">/</span>
                <span className="text-[#c9d1d9] font-semibold truncate">New Journal Entry</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {saving && <span className="text-xs text-[#8b949e] animate-pulse hidden sm:inline">Saving changes...</span>}
              <button
                type="submit"
                form="entry-form"
                disabled={saving || !title.trim() || !week}
                className="px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white border border-[rgba(240,246,252,0.1)] text-xs font-bold rounded-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Publishing...' : 'Publish Entry'}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pt-8">
          <form id="entry-form" onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
            
            {/* Main Content Area */}
            <div className="flex-1 min-w-0 space-y-6">
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-[#30363d] bg-[#0d1117]/50 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#58a6ff]" />
                  <span className="text-sm font-semibold text-white">Journal Content</span>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Title Input */}
                  <div className="space-y-1">
                    <input
                      id="entry-title"
                      className="w-full bg-transparent border-none px-0 text-3xl font-bold text-white placeholder:text-[#30363d] focus:outline-none focus:ring-0"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a descriptive title..."
                      required
                    />
                    <div className="h-[1px] w-full bg-[#30363d]" />
                  </div>

                  {/* Tiptap Editor */}
                  <div className="pt-2">
                    <TiptapEditor content={content} onChange={setContent} placeholder="Start documenting your OJT journey here..." />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar / Settings */}
            <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
              {/* Settings Card */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-[#30363d] bg-[#0d1117]/50 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#8b949e]" />
                  <span className="text-xs font-bold text-[#8b949e] uppercase tracking-wider">Entry Settings</span>
                </div>
                
                <div className="p-4 space-y-5">
                  {/* Week Picker */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#8b949e] uppercase tracking-widest" htmlFor="entry-week">
                      <Calendar className="w-3.5 h-3.5 text-[#58a6ff]" />
                      Training Week
                    </label>
                    <div className="relative group">
                      <input
                        id="entry-week"
                        className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 text-sm text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                        type="number"
                        min="1"
                        max="52"
                        value={week}
                        onChange={(e) => setWeek(e.target.value)}
                        placeholder="Week number (e.g. 1)"
                        required
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#8b949e] uppercase tracking-widest" htmlFor="entry-excerpt">
                      <Info className="w-3.5 h-3.5 text-[#58a6ff]" />
                      Summary / Excerpt
                    </label>
                    <textarea
                      id="entry-excerpt"
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-sm text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all min-h-[100px] resize-none"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Write a brief overview of this week..."
                    />
                  </div>
                </div>
              </div>

              {/* Cover Image Card */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm p-4">
                <ImageUpload onUploaded={setCoverImage} label="Entry Cover Photo" />
              </div>

              {/* Status Hint */}
              <div className="p-4 bg-[#1f6feb]/5 border border-[#1f6feb]/20 rounded-xl flex gap-3">
                <ShieldCheck className="w-5 h-5 text-[#58a6ff] shrink-0" />
                <p className="text-[11px] text-[#8b949e] leading-relaxed">
                  Your entry will be visible on the public journal timeline immediately after publishing.
                </p>
              </div>
            </aside>
            
          </form>
        </div>
      </div>
    </AdminAuth>
  );
}
