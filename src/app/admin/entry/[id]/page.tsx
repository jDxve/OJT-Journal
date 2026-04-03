"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import AdminAuth from "@/components/AdminAuth";
import { getEntry, updateEntry } from "@/lib/entries";
import MultiImageUpload from "@/components/MultiImageUpload";
import ImageUpload from "@/components/ImageUpload";
import AttendancePicker from "@/components/AttendancePicker";
import type { WeekRange, DayAttendance } from "@/lib/entries";
import {
  ArrowLeft,
  Save,
  ShieldCheck,
  Settings,
  BookOpen,
  Calendar,
  Info,
  ExternalLink,
} from "lucide-react";

const TiptapEditor = dynamic(() => import("@/components/TiptapEditor"), {
  loading: () => (
    <div className="h-[450px] bg-[#21262d] rounded-lg animate-pulse" />
  ),
  ssr: false,
});

export default function EditEntryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [week, setWeek] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [excerpt, setExcerpt] = useState("");
  const [dateRange, setDateRange] = useState<WeekRange | undefined>();
  const [attendance, setAttendance] = useState<DayAttendance[]>([]);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    if (!id) return;
    getEntry(id)
      .then((entry) => {
        if (!entry) {
          router.push("/admin");
          return;
        }
        setTitle(entry.title);
        setWeek(String(entry.week));
        setContent(entry.content);
        setCoverImage(entry.coverImage ?? '');
        setImages(entry.images ?? []);
        setExcerpt(entry.excerpt);
        setDateRange(entry.dateRange);
        setAttendance(entry.attendance ?? []);
        setTotalHours(entry.totalHours ?? 0);
        setEditorKey((k) => k + 1); // Force re-mount editor with loaded content
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !week) return;

    setSaving(true);
    try {
      await updateEntry(id, {
        title: title.trim(),
        week: parseInt(week, 10),
        content,
        coverImage,
        images,
        excerpt: excerpt.trim() || title.trim(),
        dateRange,
        attendance,
        totalHours,
      });
      router.push("/admin");
    } catch (err) {
      console.error("Update failed:", err);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminAuth>
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12 animate-pulse">
          <div className="h-4 w-48 bg-[#21262d] rounded mb-8" />
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-h-[500px] bg-[#161b22] border border-[#30363d] rounded-xl" />
            <div className="w-full lg:w-[320px] h-96 bg-[#161b22] border border-[#30363d] rounded-xl" />
          </div>
        </div>
      </AdminAuth>
    );
  }

  return (
    <AdminAuth>
      <div className="min-h-screen bg-[#0d1117] pb-24 text-[#c9d1d9]">
        {/* Sub-header / Breadcrumbs */}
        <div className="border-b border-[#30363d] bg-[#161b22]/50 backdrop-blur-md sticky top-[65px] z-30">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <Link
                href="/admin"
                className="text-[#8b949e] hover:text-[#58a6ff] transition-colors shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="h-4 w-[1px] bg-[#30363d] mx-1 shrink-0" />
              <div className="flex items-center gap-2 text-sm font-medium overflow-hidden">
                <span className="text-[#8b949e] truncate">Admin</span>
                <span className="text-[#30363d]">/</span>
                <span className="text-[#c9d1d9] font-semibold truncate">
                  Edit: {title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/entry/${id}`}
                target="_blank"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Preview
              </Link>
              <button
                type="submit"
                form="edit-entry-form"
                disabled={saving || !title.trim() || !week}
                className="px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white border border-[rgba(240,246,252,0.1)] text-xs font-bold rounded-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pt-8">
          <form
            id="edit-entry-form"
            onSubmit={handleSubmit}
            className="flex flex-col lg:flex-row gap-8"
          >
            {/* Main Content Area */}
            <div className="flex-1 min-w-0 space-y-6">
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-[#30363d] bg-[#0d1117]/50 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#58a6ff]" />
                  <span className="text-sm font-semibold text-white">
                    Journal Content
                  </span>
                </div>

                <div className="p-6 space-y-6">
                  {/* Title Input */}
                  <div className="space-y-1">
                    <input
                      id="edit-title"
                      className="w-full bg-transparent border-none px-0 text-3xl font-bold text-white placeholder:text-[#30363d] focus:outline-none focus:ring-0"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Entry title"
                      required
                    />
                    <div className="h-[1px] w-full bg-[#30363d]" />
                  </div>

                  {/* Photos */}
                  <MultiImageUpload
                    onUploaded={setImages}
                    currentImages={images}
                  />

                  {/* Tiptap Editor */}
                  <div className="pt-2">
                    <TiptapEditor
                      key={editorKey}
                      content={content}
                      onChange={setContent}
                      placeholder="Start writing..."
                    />
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
                  <span className="text-xs font-bold text-[#8b949e] uppercase tracking-wider">
                    Settings
                  </span>
                </div>

                <div className="p-4 space-y-5">
                  {/* Week Picker */}
                  <div className="space-y-2">
                    <label
                      className="flex items-center gap-2 text-xs font-bold text-[#8b949e] uppercase tracking-widest"
                      htmlFor="edit-week"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#58a6ff]" />
                      Training Week
                    </label>
                    <input
                      id="edit-week"
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 text-sm text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                      type="number"
                      min="1"
                      value={week}
                      onChange={(e) => setWeek(e.target.value)}
                      placeholder="1"
                      required
                    />
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-2">
                    <label
                      className="flex items-center gap-2 text-xs font-bold text-[#8b949e] uppercase tracking-widest"
                      htmlFor="edit-excerpt"
                    >
                      <Info className="w-3.5 h-3.5 text-[#58a6ff]" />
                      Excerpt
                    </label>
                    <textarea
                      id="edit-excerpt"
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-sm text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all min-h-[100px] resize-none"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Short summary..."
                    />
                  </div>
                </div>
              </div>

              {/* Attendance / Timeline Card */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm p-4">
                <AttendancePicker
                  value={{ dateRange, attendance, totalHours }}
                  onChange={(data) => {
                    setDateRange(data.dateRange);
                    setAttendance(data.attendance);
                    setTotalHours(data.totalHours);
                  }}
                />
              </div>

              {/* Cover Photo Card */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm p-4">
                <ImageUpload
                  onUploaded={setCoverImage}
                  label="Cover Photo"
                  currentImage={coverImage}
                />
              </div>

              {/* Status Hint */}
              <div className="p-4 bg-[#1f6feb]/5 border border-[#1f6feb]/20 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#58a6ff] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#8b949e] leading-relaxed">
                  Your changes will be saved to the database and synced across
                  the live journal timeline.
                </p>
              </div>
            </aside>
          </form>
        </div>
      </div>
    </AdminAuth>
  );
}
