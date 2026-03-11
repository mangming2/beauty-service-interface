"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/common/Icons";

const COMMUNITY_POSTS = [
  { id: "c1", title: "커버 댄스 인원 구합니다.", date: "202.01.06" },
  { id: "c2", title: "2026년 도키 가맹 업체 안내", date: "25.12.21" },
];

export default function BoardCommunityPage() {
  return (
    <ul className="divide-y divide-gray-outline px-4">
      {COMMUNITY_POSTS.map(post => (
        <li key={post.id}>
          <Link
            href={`/board/${post.id}`}
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
