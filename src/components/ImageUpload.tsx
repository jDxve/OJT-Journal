'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { uploadImage } from '@/lib/storage';
import { ImageIcon, X, UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onUploaded: (url: string) => void;
  label?: string;
  currentImage?: string;
  maxSizeMB?: number;
}

export default function ImageUpload({
  onUploaded,
  label = 'Cover Image',
  currentImage,
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with currentImage when it changes (e.g., after initial load)
  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
    }
  }, [currentImage]);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      
      // Validation
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file.');
        return;
      }
      
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Image size must be less than ${maxSizeMB}MB.`);
        return;
      }

      setUploading(true);
      setProgress(0);

      // Optimistic preview
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);

      try {
        const url = await uploadImage(file, (pct) => setProgress(pct));
        setPreview(url);
        onUploaded(url);
      } catch (err) {
        console.error('Upload failed:', err);
        setError('Upload failed. Please try again.');
        setPreview(currentImage || null);
      } finally {
        setUploading(false);
      }
    },
    [onUploaded, currentImage, maxSizeMB]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onUploaded('');
    setError(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#8b949e] uppercase tracking-widest">{label}</label>
        {preview && !uploading && (
          <button 
            type="button" 
            onClick={clearImage}
            className="text-[11px] font-semibold text-[#f85149] hover:underline transition-all"
          >
            Remove Image
          </button>
        )}
      </div>

      <div 
        className={`relative group rounded-xl border-2 border-dashed overflow-hidden transition-all duration-300 min-h-[140px] flex flex-col items-center justify-center cursor-pointer ${
          dragging 
            ? 'border-[#58a6ff] bg-[#58a6ff]/5' 
            : preview 
              ? 'border-transparent' 
              : 'border-[#30363d] bg-[#0d1117] hover:border-[#8b949e] hover:bg-[#161b22]'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {preview ? (
          <div className="relative w-full h-full">
            <img 
              src={preview} 
              alt="Preview" 
              className={`w-full h-auto max-h-[280px] object-cover transition-opacity duration-500 ${uploading ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`} 
            />
            
            {uploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#0d1117]/40 backdrop-blur-[2px]">
                <div className="relative w-12 h-12 mb-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" stroke="#21262d" strokeWidth="8"
                    />
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" stroke="#3fb950" strokeWidth="8"
                      strokeDasharray="282.7"
                      strokeDashoffset={282.7 - (282.7 * progress) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                    {Math.round(progress)}%
                  </div>
                </div>
                <p className="text-sm font-medium text-white shadow-sm">Uploading photo...</p>
              </div>
            )}
            
            {!uploading && (
              <div className="absolute inset-0 bg-[#0d1117]/0 group-hover:bg-[#0d1117]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10 rounded-xl">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full shadow-xl">
                  <UploadCloud className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
            
            {/* Success indicator momentarily */}
            {!uploading && progress === 100 && (
              <div className="absolute top-4 right-4 bg-[#238636] p-1.5 rounded-full shadow-lg animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className="w-7 h-7 text-[#8b949e] group-hover:text-[#58a6ff]" />
            </div>
            <p className="text-sm font-medium text-[#c9d1d9] mb-1">
              Click or drag image to upload
            </p>
            <p className="text-xs text-[#8b949e]">
              PNG, JPG or WEBP (Max {maxSizeMB}MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-[#f85149] text-xs font-medium bg-[#f85149]/10 p-2 rounded-md border border-[#f85149]/20 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}
    </div>
  );
}
