import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface DayAttendance {
  date: string; // ISO "YYYY-MM-DD"
  type: 'full' | 'half' | 'absent';
}

export interface WeekRange {
  start: string; // ISO "YYYY-MM-DD"
  end: string;
  label: string; // e.g. "February 23–28, 2026"
}

export interface JournalEntry {
  id: string;
  week: number;
  title: string;
  content: string;
  coverImage: string;
  images?: string[];
  excerpt: string;
  dateRange?: WeekRange;
  attendance?: DayAttendance[];
  totalHours?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const COLLECTION = 'journal-entries';
const SESSION_KEY = 'ojt_entries_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// In-memory pointer — avoids even the sessionStorage parse on same-session navigation
let memCache: JournalEntry[] | null = null;

function readSessionCache(): JournalEntry[] | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as { data: JournalEntry[]; ts: number };
    if (Date.now() - ts > CACHE_TTL) return null;
    // Restore Firestore Timestamps from plain objects
    return data.map((e) => ({
      ...e,
      createdAt: new Timestamp(e.createdAt.seconds, e.createdAt.nanoseconds),
      updatedAt: new Timestamp(e.updatedAt.seconds, e.updatedAt.nanoseconds),
    }));
  } catch {
    return null;
  }
}

function writeSessionCache(data: JournalEntry[]) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // sessionStorage unavailable (SSR or private mode) — silently skip
  }
}

function invalidateCache() {
  memCache = null;
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}

/** Get all entries, ordered by week ascending */
export async function getEntries(): Promise<JournalEntry[]> {
  // 1. In-memory hit (same-session navigation — zero cost)
  if (memCache) return memCache;

  // 2. sessionStorage hit (page refresh — synchronous, instant)
  const cached = readSessionCache();
  if (cached) { memCache = cached; return cached; }

  // 3. Firestore fetch (first load or after mutation)
  const q = query(collection(db, COLLECTION), orderBy('week', 'asc'));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as JournalEntry));
  memCache = data;
  writeSessionCache(data);
  return data;
}

/** Get a single entry by ID */
export async function getEntry(id: string): Promise<JournalEntry | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as JournalEntry;
}

/** Create a new entry */
export async function createEntry(
  data: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const now = Timestamp.now();
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  invalidateCache();
  return ref.id;
}

/** Update an existing entry */
export async function updateEntry(
  id: string,
  data: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
  invalidateCache();
}

/** Delete an entry */
export async function deleteEntry(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
  invalidateCache();
}
