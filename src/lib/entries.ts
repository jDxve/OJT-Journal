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

/** Get all entries, ordered by week ascending */
export async function getEntries(): Promise<JournalEntry[]> {
  const q = query(collection(db, COLLECTION), orderBy('week', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as JournalEntry));
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
}

/** Delete an entry */
export async function deleteEntry(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
