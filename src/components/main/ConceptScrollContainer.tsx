"use client";

import { useRef, useState, ReactNode } from "react";

interface ConceptScrollContainerProps {
  children: ReactNode;
}

export function ConceptScrollContainer({
  children,
}: ConceptScrollContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    // 이미지나 링크에서 시작하는 드래그는 무시
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG" || target.closest("a")) {
      return;
    }
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // 스크롤 속도 조절
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    // Shift 키를 누르거나 수평 스크롤이 있을 때만 좌우 스크롤
    if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      scrollRef.current.scrollLeft += e.deltaX || e.deltaY;
    }
  };

  return (
    <div
      ref={scrollRef}
      className={`flex flex-nowrap gap-[4px] overflow-x-auto pb-2 scrollbar-hide ${
        isDragging ? "select-none" : ""
      }`}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      onDragStart={e => {
        // 이미지나 링크가 아닐 때만 드래그 차단
        const target = e.target as HTMLElement;
        if (target.tagName !== "IMG" && !target.closest("a")) {
          e.preventDefault();
        }
      }}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-x",
      }}
    >
      {children}
    </div>
  );
}
