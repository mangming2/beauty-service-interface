"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BoardPostDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="min-h-screen text-white bg-background px-4 py-6">
      <p className="text-gray-400 text-sm">게시글 ID: {id}</p>
      <p className="text-white mt-2">
        게시글 상세 페이지는 준비 중입니다.
      </p>
      <Link href="/board/notice" className="inline-block mt-4">
        <Button variant="outline" className="text-white border-gray-500">
          목록으로
        </Button>
      </Link>
    </div>
  );
}
