'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { uploadImage } from '@/lib/storage';
import { UploadCloud, X, Plus, AlertCircle, ImageIcon } from 'lucide-react';

interface MultiImageUploadProps {
  onUploaded: (urls: string[]) => void;
  currentImages?: string[];
  maxImages?: number;
  maxSizeMB?: number;
}

export default function MultiImageUpload({
  onUploaded,
  currentImages = [],
  maxImages = 10,
  maxSizeMB = 5,
}: MultiImageUploadProps) {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentImages.length > 0) {
      setImages(currentImages);
    }
  }, [currentImages.join(',')]);

  const handleFiles = useCallback(
    async (files: File[]) => {
      setError(null);

      const remaining = maxImages - images.length;
      if (files.length > remaining) {
        setError(`You can only add ${remaining} more image${remaining === 1 ? '' : 's'}.`);
        return;
      }

      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          setError('Please upload image files only.');
          return;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          setError(`Each image must be under ${maxSizeMB}MB.`);
          return;
        }
      }

      setUploading(true);
      try {
        const urls = await Promise.all(files.map((f) => uploadImage(f)));
        const updated = [...images, ...urls];
        setImages(updated);
        onUploaded(updated);
      } catch {
        setError('Upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    [images, maxImages, maxSizeMB, onUploaded]
  );

  const remove = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx);
    setImages(updated);
    onUploaded(updated);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) handleFiles(files);
  };

  const canAdd = images.length < maxImages && !uploading;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#8b949e] uppercase tracking-widest">
          Photos
        </label>
        <span className="text-[11px] text-[#8b949e]">
          {images.length}/{maxImages}
        </span>
      </div>

      {/* Thumbnail row */}
      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((url, i) => (
            <div
              key={i}
              className="relative shrink-0 w-[72px] h-[72px] rounded-lg overflow-hidden border border-[#30363d] group"
            >
              <img
                src={url}
                alt={`Photo ${i + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
              {/* Cover badge */}
              {i === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-[#238636]/90 text-white text-[8px] font-bold text-center py-0.5 tracking-wider">
                  COVER
                </div>
              )}
              {/* Remove button */}
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 w-[18px] h-[18px] bg-[#0d1117]/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#f85149]/80"
              >
                <X className="w-2.5 h-2.5 text-white" />
              </button>
            </div>
          ))}

          {/* Add more button */}
          {canAdd && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="shrink-0 w-[72px] h-[72px] rounded-lg border-2 border-dashed border-[#30363d] flex flex-col items-center justify-center gap-1 hover:border-[#58a6ff] hover:bg-[#58a6ff]/5 transition-all text-[#8b949e] hover:text-[#58a6ff]"
            >
              <Plus className="w-4 h-4" />
              <span className="text-[9px] font-semibold uppercase tracking-wider">Add</span>
            </button>
          )}
        </div>
      )}

      {/* Empty state / Drop zone */}
      {images.length === 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`rounded-xl border-2 border-dashed transition-all cursor-pointer min-h-[140px] flex flex-col items-center justify-center p-6 text-center ${
            dragging
              ? 'border-[#58a6ff] bg-[#58a6ff]/5'
              : 'border-[#30363d] bg-[#0d1117] hover:border-[#8b949e] hover:bg-[#161b22]'
          }`}
        >
          {uploading ? (
            <div className="w-6 h-6 border-2 border-[#58a6ff] border-t-transparent rounded-full animate-spin mb-3" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6 text-[#8b949e]" />
            </div>
          )}
          <p className="text-sm font-medium text-[#c9d1d9] mb-1">
            {uploading ? 'Uploading...' : 'Click or drag images to upload'}
          </p>
          <p className="text-xs text-[#8b949e]">
            PNG, JPG or WEBP · Max {maxSizeMB}MB each · Up to {maxImages} photos
          </p>
        </div>
      )}

      {/* Uploading overlay on thumbnail row */}
      {uploading && images.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-[#8b949e]">
          <div className="w-3.5 h-3.5 border-2 border-[#58a6ff] border-t-transparent rounded-full animate-spin" />
          Uploading...
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          if (e.target.files) handleFiles(Array.from(e.target.files));
          e.target.value = '';
        }}
        className="hidden"
      />

      {error && (
        <div className="flex items-center gap-2 text-[#f85149] text-xs font-medium bg-[#f85149]/10 border border-[#f85149]/20 px-3 py-2 rounded-md">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
