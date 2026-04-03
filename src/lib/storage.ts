import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload an image file to Firebase Storage.
 * Returns the public download URL.
 * Optionally accepts an onProgress callback (0-100).
 */
export async function uploadImage(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  const storageRef = ref(storage, `journal-images/${filename}`);
  const task = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snap) => {
        const pct = (snap.bytesTransferred / snap.totalBytes) * 100;
        onProgress?.(pct);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

/** Delete an image from Firebase Storage by its download URL */
export async function deleteImage(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    console.warn('Failed to delete image from storage:', url);
  }
}
