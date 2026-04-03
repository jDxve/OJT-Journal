"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Star,
  Activity,
  GitCommit,
  Hash,
  GraduationCap,
  Search,
} from "lucide-react";
import Image from "next/image";

const mockEntries = [
  {
    id: "4",
    week: 4,
    title: "Projects Feature, Ticketing Center, and Code Formatting",
    excerpt:
      "This week we focused on finalizing the core HRIS features, primarily adding the projects feature and ticketing center for employee requests. I also spent time setting up code formatting tools.",
    date: "Mar 09, 2026",
    status: "Completed",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=400",
  },
  {
    id: "3",
    week: 3,
    title: "Realignment, Timekeeping, Dark Mode Integration",
    excerpt:
      "Integrated a fully functional dark mode theme matching the requested aesthetic. Also worked on aligning the timekeeping module with the backend API.",
    date: "Mar 02, 2026",
    status: "Completed",
    image:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800&h=400",
  },
  {
    id: "2",
    week: 2,
    title: "Expanding the HRIS – Auth, Employee Management",
    excerpt:
      "Vastly expanded the HRIS platform by wiring up the authentication service and building the interactive tables for the employee management dashboard.",
    date: "Feb 23, 2026",
    status: "Completed",
  },
  {
    id: "1",
    week: 1,
    title: "Orientation & Kicking Off the Quanby HRIS",
    excerpt:
      "First week at Quanby. Went through onboarding, met the team, and got started setting up the Next.js boilerplate for the new HRIS system.",
    date: "Feb 20, 2026",
    status: "Completed",
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEntries = mockEntries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
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
            <button className="flex items-center gap-2 text-[#8b949e] hover:text-white transition-colors">
              <Activity className="w-4 h-4" /> Activity
            </button>
          </div>
        </div>
        <div>
          <a
            href="/admin"
            className="text-sm font-semibold border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-md transition-colors flex items-center gap-2"
          >
            <LockIcon /> Admin Panel
          </a>
        </div>
      </nav>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 pt-8 flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-20">
        {/* Left Sidebar */}
        <aside className="w-full md:w-[280px] lg:w-[296px] shrink-0 space-y-6 md:sticky md:top-24 self-start">
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
                    <span className="font-medium truncate">
                      Bachelor of Science in Information Technology
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#8b949e] shrink-0" />
                    <span className="font-medium truncate">
                      Quanby OJT Program
                    </span>
                  </div>
                  <div className="flex items-center gap-2 line-clamp-1">
                    <BookOpen className="w-4 h-4 text-[#8b949e] shrink-0" />
                    <span className="text-[#8b949e] shrink-0">System:</span>
                    <span className="font-semibold text-[#58a6ff] hover:underline cursor-pointer truncate">
                      Payroll Management
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-[#30363d] my-6 md:my-8" />

            {/* OJT Progress Status */}
            <div className="space-y-3 pb-2">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#3fb950]" />
                OJT Journal Progress
              </h3>

              <div className="space-y-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#8b949e]">Timeline</span>
                  <span className="font-medium text-white">
                    {mockEntries.length} of 8 weeks logged
                  </span>
                </div>

                {/* Progress bar background */}
                <div className="w-full bg-[#21262d] rounded-full h-2.5 overflow-hidden shadow-inner">
                  {/* Progress bar fill */}
                  <div
                    className="bg-gradient-to-r from-[#2ea043] to-[#3fb950] h-full rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${(mockEntries.length / 8) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white/10 rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#8b949e] mt-2 pt-2 border-t border-[#30363d]">
                  <span>0 hrs</span>
                  <span className="text-[#3fb950] font-semibold">
                    {mockEntries.length * 40} hrs credited
                  </span>
                  <span>320 hrs</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area - Timeline/List */}
        <main className="flex-1 min-w-0 md:h-[calc(100vh-65px)] md:overflow-y-auto md:scrollbar">
          <div className="mb-0 mt-2 sticky top-0 z-40 bg-[#0d1117] pb-8 pt-2">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-2xl font-semibold text-white tracking-tight">
                  My Weekly Journal
                </h2>
                <p className="text-sm text-[#8b949e] mt-1">
                  A comprehensive timeline of my On the Job Training.
                </p>
              </div>
              <div className="relative shrink-0 w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8b949e] pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#21262d] border border-[#30363d] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-colors"
                />
              </div>
            </div>
          </div>
          <div className="relative border-l border-[#30363d] ml-3 md:ml-4 space-y-10 pb-8">
            {[...filteredEntries].reverse().map((entry) => (
              <div key={entry.id} className="relative pl-8 md:pl-10">
                {/* Timeline Node */}
                <div className="absolute left-[-16px] top-4 w-8 h-8 bg-[#238636] border border-[rgba(240,246,252,0.1)] rounded-full flex flex-col items-center justify-center shadow-sm">
                  <GitCommit className="w-4 h-4 text-white opacity-80" />
                </div>

                {/* Entry Action Text */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2 text-sm text-[#8b949e]">
                  <img
                    src="/images/profile.png"
                    className="w-6 h-6 rounded-full border border-[#30363d]"
                  />
                  <span className="font-semibold text-[#c9d1d9]">jDxve</span>
                  <span>uploaded a weekly entry for week-{entry.week}</span>
                  <span className="text-[#8b949e]">· {entry.date}</span>
                </div>

                {/* Entry Card */}
                <div className="border border-[#30363d] bg-[#0d1117] rounded-xl overflow-hidden hover:border-[#8b949e] transition-colors group">
                  {/* Card Header */}
                  <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center shrink-0 bg-[#238636] border border-[rgba(240,246,252,0.1)] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full gap-1 shadow-sm">
                        <Hash
                          className="w-3 h-3 text-white/70"
                          strokeWidth={2.5}
                        />{" "}
                        Week {entry.week}
                      </span>
                      <h3 className="font-semibold text-white group-hover:text-[#58a6ff] transition-colors line-clamp-2 md:line-clamp-1">
                        {entry.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 md:p-6 grid gap-4">
                    {entry.image && (
                      <div className="w-full h-48 md:h-64 bg-[#21262d] rounded-lg overflow-hidden border border-[#30363d]">
                        <img
                          src={entry.image}
                          alt={entry.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <p className="text-sm text-[#8b949e] leading-relaxed">
                      {entry.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center justify-between mt-2 pt-4 border-t border-[#30363d] gap-4">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-[#c9d1d9] bg-[#21262d] px-2 py-1 rounded-md border border-[#30363d]">
                          <span className="w-2 h-2 rounded-full bg-[#3fb950]"></span>{" "}
                          {entry.status}
                        </span>
                      </div>
                      <a
                        href={`/entry/${entry.id}`}
                        className="flex items-center gap-1.5 text-sm font-semibold text-[#58a6ff] hover:underline group-hover:translate-x-1 transition-transform"
                      >
                        Read Entry <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function LockIcon() {
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
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
