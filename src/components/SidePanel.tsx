'use client';

import { X, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  mode?: 'fixed' | 'absolute';
}

export default function SidePanel({ isOpen, onClose, children, title, mode = 'fixed' }: SidePanelProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        setMounted(false);
      }, 300);
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted && !isOpen) return null;

  return (
    <div className={`${mode} inset-0 z-[100] flex justify-end overflow-hidden pointer-events-none`}>
      {/* Backdrop */}
      <div
        className={`${mode} inset-0 bg-black/40 transition-opacity duration-300 ease-in-out pointer-events-auto ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full ${mode === 'absolute' ? 'max-w-none' : 'max-w-3xl'} bg-[#0d1117] shadow-2xl transition-transform duration-300 ease-in-out transform pointer-events-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } h-full flex flex-col overflow-visible`}
      >
        {/* Custom Interrupted Border (Divider Gap) */}
        <div className="absolute left-0 top-0 w-[1px] h-[126px] bg-[#30363d] z-50" />
        <div className="absolute left-0 top-[158px] bottom-0 w-[1px] bg-[#30363d] z-50" />

        {/* Divider-aligned Close Button */}
        <button
          onClick={onClose}
          className="absolute -left-4 top-[126px] w-8 h-8 bg-[#0d1117] border border-[#30363d] rounded-full flex items-center justify-center text-[#c9d1d9] hover:text-white hover:bg-[#161b22] shadow-2xl transition-all hover:scale-110 active:scale-95 z-[110]"
          aria-label="Hide panel"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0d1117]">
          {children}
        </div>
      </div>
    </div>
  );
}
