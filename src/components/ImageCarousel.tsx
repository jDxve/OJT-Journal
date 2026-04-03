'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  alt?: string;
}

export default function ImageCarousel({ images, alt = 'Journal image' }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (!images.length) return null;

  // Single image — no carousel chrome needed
  if (images.length === 1) {
    return (
      <div className="w-full rounded-xl overflow-hidden border border-[#30363d] mb-10 bg-[#161b22]">
        <img
          src={images[0]}
          alt={alt}
          className="w-full object-cover max-h-[500px]"
          draggable={false}
        />
      </div>
    );
  }

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(images.length - 1, c + 1));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      if (delta > 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  return (
    <div className="relative w-full mb-10 rounded-xl overflow-hidden border border-[#30363d] bg-[#161b22] group select-none">
      {/* Slide track */}
      <div
        className="overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((src, i) => (
            <div key={i} className="w-full shrink-0">
              <img
                src={src}
                alt={`${alt} ${i + 1}`}
                className="w-full object-cover max-h-[500px]"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Prev button */}
      {current > 0 && (
        <button
          type="button"
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0d1117]/70 backdrop-blur-sm border border-[#30363d]/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#0d1117]/90 shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Next button */}
      {current < images.length - 1 && (
        <button
          type="button"
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0d1117]/70 backdrop-blur-sm border border-[#30363d]/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#0d1117]/90 shadow-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Counter badge (top-right) */}
      <div className="absolute top-3 right-3 bg-[#0d1117]/70 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-1 rounded-md border border-[#30363d]/40 shadow-sm">
        {current + 1} / {images.length}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-5 h-[5px] bg-white shadow-md'
                : 'w-[5px] h-[5px] bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
