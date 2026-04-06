'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import type { DayAttendance, WeekRange } from '@/lib/entries';

interface AttendancePickerProps {
  value?: { dateRange?: WeekRange; attendance?: DayAttendance[]; totalHours?: number };
  onChange: (data: { dateRange: WeekRange; attendance: DayAttendance[]; totalHours: number }) => void;
}

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat'];

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDays(monday: Date): Date[] {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatRange(days: Date[]): string {
  if (!days.length) return '';
  const start = days[0];
  const end = days[days.length - 1];
  const sm = MONTHS[start.getMonth()];
  const em = MONTHS[end.getMonth()];
  const yr = end.getFullYear();
  if (sm === em) return `${sm} ${start.getDate()}–${end.getDate()}, ${yr}`;
  return `${sm} ${start.getDate()} – ${em} ${end.getDate()}, ${yr}`;
}

const HOURS = { full: 8, half: 4, absent: 0 } as const;

const STATUS_STYLES = {
  full:   { label: 'Full',   bg: 'bg-[#238636]',         text: 'text-white',      border: 'border-[#2ea043]'  },
  half:   { label: 'Half',   bg: 'bg-[#9e6a03]',         text: 'text-white',      border: 'border-[#d29922]'  },
  absent: { label: '—',      bg: 'bg-[#0d1117]',         text: 'text-[#484f58]',  border: 'border-[#30363d]'  },
};

export default function AttendancePicker({ value, onChange }: AttendancePickerProps) {
  const [monday, setMonday] = useState<Date>(() => getMondayOf(new Date()));
  const [attendance, setAttendance] = useState<Record<string, DayAttendance['type']>>({});
  // Suppress emit on initial mount and when loading saved data — only emit on user interaction
  const suppressEmit = useRef(true);

  // Re-run whenever saved dateRange arrives (e.g. async Firestore load on edit page)
  useEffect(() => {
    if (value?.dateRange?.start) {
      suppressEmit.current = true;
      const m = getMondayOf(new Date(value.dateRange.start + 'T00:00:00'));
      setMonday(m);

      if (value?.attendance?.length) {
        const days = getWeekDays(m);
        const sorted = [...value.attendance].sort((a, b) => a.date.localeCompare(b.date));
        const map: Record<string, DayAttendance['type']> = {};
        sorted.forEach((att, i) => {
          if (i < days.length) map[toISO(days[i])] = att.type;
        });
        setAttendance(map);
      }
    }
  }, [value?.dateRange?.start]);

  const weekDays = getWeekDays(monday);

  const prevWeek = () => {
    const d = new Date(monday);
    d.setDate(d.getDate() - 7);
    setMonday(d);
  };

  const nextWeek = () => {
    const d = new Date(monday);
    d.setDate(d.getDate() + 7);
    setMonday(d);
  };

  const toggle = (iso: string) => {
    const current = attendance[iso] ?? 'absent';
    const next: DayAttendance['type'] =
      current === 'absent' ? 'full' : current === 'full' ? 'half' : 'absent';
    const updated = { ...attendance, [iso]: next };
    setAttendance(updated);
    emit(updated);
  };

  const emit = (map: Record<string, DayAttendance['type']>) => {
    const days = weekDays.map((d) => toISO(d));
    const att: DayAttendance[] = days.map((date) => ({
      date,
      type: map[date] ?? 'absent',
    }));
    const totalHours = att.reduce((s, d) => s + HOURS[d.type], 0);
    const label = formatRange(weekDays);
    onChange({
      dateRange: { start: days[0], end: days[days.length - 1], label },
      attendance: att,
      totalHours,
    });
  };

  // Emit on week navigation — skip on mount and on load
  useEffect(() => {
    if (suppressEmit.current) {
      suppressEmit.current = false;
      return;
    }
    emit(attendance);
  }, [monday]);

  const totalHours = weekDays.reduce(
    (s, d) => s + HOURS[attendance[toISO(d)] ?? 'absent'],
    0,
  );

  const rangeLabel = formatRange(weekDays);
  const mondayLabel = `${MONTHS[monday.getMonth()]} ${monday.getFullYear()}`;

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-[#8b949e] uppercase tracking-widest">
        Weekly Timeline
      </label>

      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden">
        {/* Week navigator */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d]">
          <button
            type="button"
            onClick={prevWeek}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#21262d] text-[#8b949e] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center">
            <div className="text-xs text-[#8b949e] font-medium">{mondayLabel}</div>
            <div className="text-sm font-semibold text-white mt-0.5">{rangeLabel}</div>
          </div>

          <button
            type="button"
            onClick={nextWeek}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#21262d] text-[#8b949e] hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-6 gap-px bg-[#21262d] border-b border-[#30363d]">
          {weekDays.map((day, i) => {
            const iso = toISO(day);
            const status = attendance[iso] ?? 'absent';
            const s = STATUS_STYLES[status];

            return (
              <button
                key={iso}
                type="button"
                onClick={() => toggle(iso)}
                className={`flex flex-col items-center py-3 gap-1 ${s.bg} transition-colors hover:opacity-90 active:opacity-75`}
                title={`Click to cycle: absent → full day → half day`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider ${s.text} opacity-70`}>
                  {DAYS[i]}
                </span>
                <span className={`text-base font-bold ${s.text}`}>
                  {day.getDate()}
                </span>
                <span className={`text-[9px] font-semibold ${s.text} opacity-80`}>
                  {status === 'absent' ? '—' : status === 'full' ? '8h' : '4h'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Summary */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px] text-[#8b949e]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#238636] inline-block" />
              Full (8h)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#9e6a03] inline-block" />
              Half (4h)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#21262d] border border-[#30363d] inline-block" />
              Absent
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-white">
            <Clock className="w-3.5 h-3.5 text-[#58a6ff]" />
            {totalHours}h
          </div>
        </div>
      </div>
    </div>
  );
}
