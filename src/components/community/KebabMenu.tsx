"use client";

import { useEffect, useRef, useState } from "react";

interface KebabMenuProps {
  onDelete: () => void;
}

export function KebabMenu({ onDelete }: KebabMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={e => {
          e.stopPropagation();
          setOpen(v => !v);
        }}
        className="w-7 h-7 flex items-center justify-center text-gray_1 hover:text-white rounded-full hover:bg-white/10"
        aria-label="더보기"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-8 z-30 min-w-[80px] rounded-lg bg-gray-800 border border-gray-600 shadow-lg py-1"
        >
          <button
            role="menuitem"
            onClick={e => {
              e.stopPropagation();
              setOpen(false);
              onDelete();
            }}
            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
