import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './firebase';

/** Compress and resize an image to max 1200px wide, JPEG 85% quality */
async function compressImage(file: File): Promise<Blob> {
  const MAX_WIDTH = 1200;
  const QUALITY = 0.85;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not supported'));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Compression failed'))),
        'image/jpeg',
        QUALITY,
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Upload an image file to Firebase Storage.
 * Compresses to JPEG 1200px / 85% quality before uploading.
 * Returns the public download URL.
 * Optionally accepts an onProgress callback (0-100).
 */
export async function uploadImage(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const compressed = await compressImage(file);
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}.jpg`;
  const storageRef = ref(storage, `journal-images/${filename}`);
  const task = uploadBytesResumable(storageRef, compressed, { contentType: 'image/jpeg' });

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
