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

  return (
    <div
      ref={scrollRef}
      className={`flex gap-[4px] overflow-x-auto pb-2 scrollbar-hide ${
        isDragging ? "select-none" : ""
      }`}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onDragStart={e => {
        // 모든 드래그 시작을 차단
        e.preventDefault();
      }}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {children}
    </div>
  );
}
