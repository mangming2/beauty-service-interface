"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/common/Icons";

const NOTICE_POSTS = [
  { id: "1", title: "이벤트 당첨자 발표", date: "202.01.06" },
  { id: "2", title: "2026년 도키 가맹 업체 안내", date: "25.12.21" },
  { id: "3", title: "아무튼 발표", date: "25.07.14" },
  { id: "4", title: "DOKI 모바일 서비스 출시 안내", date: "25.07.14" },
];

export default function BoardNoticePage() {
  return (
    <ul className="divide-y divide-gray-outline px-4">
      {NOTICE_POSTS.map(post => (
        <li key={post.id}>
          <Link
            href={`/board/notice/${post.id}`}
            className="flex items-center justify-between py-4"
          >
            <div>
              <p className="text-md text-white">{post.title}</p>
              <p className="caption-md text-gray_1 mt-0.5">{post.date}</p>
            </div>
            <ArrowRightIcon
              color="#FFFFFE"
              width={6}
              height={16}
              className="size-auto shrink-0"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
