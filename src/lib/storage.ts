import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './firebase';

/** Compress and resize an image to max 1024px wide, JPEG 75% quality */
async function compressImage(file: File): Promise<Blob> {
  const MAX_WIDTH = 1024;
  const QUALITY = 0.75;

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
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

/**
 * Upload an image file to Firebase Storage.
 * Compresses to JPEG 1024px / 75% quality before uploading.
 * Returns the public download URL.
 * Optionally accepts an onProgress callback (0-100).
 */
export async function uploadImage(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  // Show immediate feedback so the UI doesn't look frozen
  onProgress?.(5);

  const compressed = await compressImage(file);

  // Compression done — jump to 25% before starting network upload
  onProgress?.(25);

  const safeName = file.name.replace(/[^a-zA-Z0-9-]/g, '_');
  const filename = `${Date.now()}-${safeName}.jpg`;
  const storageRef = ref(storage, `journal-images/${filename}`);
  const task = uploadBytesResumable(storageRef, compressed, { contentType: 'image/jpeg' });

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snap) => {
        // Scale network upload progress from 25% → 100%
        const uploadPct = (snap.bytesTransferred / snap.totalBytes) * 75;
        onProgress?.(25 + uploadPct);
      },
      reject,
      async () => {
        onProgress?.(100);
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

/** Delete an image from Firebase Storage by its download URL */
export async function deleteImage(url: string): Promise<void> {
  try {
    // Firebase download URLs are:
    // https://firebasestorage.googleapis.com/v0/b/BUCKET/o/ENCODED_PATH?token=...
    const urlObj = new URL(url);
    const match = urlObj.pathname.match(/\/v0\/b\/[^/]+\/o\/(.+)/);
    if (!match) throw new Error('Unrecognized storage URL');
    const storagePath = decodeURIComponent(match[1]);
    await deleteObject(ref(storage, storagePath));
  } catch {
    console.warn('Failed to delete image from storage:', url);
  }
}
