"use client";

import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowRightIcon } from "@/components/common/Icons";
import { TranslatedText } from "@/components/main/TranslatedText";

const EVENT_POSTS = [
  { id: "1", title: "이벤트 당첨자 발표", date: "202.01.06" },
  { id: "2", title: "2026년 도키 가맹 업체 안내", date: "25.12.21" },
  { id: "3", title: "아무튼 발표", date: "25.07.14" },
  { id: "4", title: "DOKI 모바일 서비스 출시 안내", date: "25.07.14" },
];

const COMMUNITY_POSTS = [
  { id: "c1", title: "커버 댄스 인원 구합니다.", date: "202.01.06" },
  { id: "c2", title: "2026년 도키 가맹 업체 안내", date: "25.12.21" },
];

export default function BoardPage() {
  return (
    <div className="min-h-screen text-white bg-background">
      <Tabs defaultValue="events" className="w-full">
        <div className="pt-6 border-b border-gray-outline px-4">
          <TabsList className="bg-transparent p-0 gap-6 rounded-none w-fit justify-start border-0">
            <TabsTrigger
              value="community"
              className="relative title-sm flex-initial bg-transparent border-0 text-gray-400 data-[state=active]:text-pink-font data-[state=active]:bg-transparent hover:text-white transition-colors duration-200 pb-3 pt-0 px-0 rounded-none after:absolute after:left-0 after:right-0 after:h-px after:bottom-0 after:bg-gray-outline data-[state=active]:after:bg-pink-font"
            >
              <span className="relative z-[1]">
                <TranslatedText translationKey="community" />
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="relative title-sm flex-initial bg-transparent border-0 text-gray-400 data-[state=active]:text-pink-font data-[state=active]:bg-transparent hover:text-white transition-colors duration-200 pb-3 pt-0 px-0 rounded-none after:absolute after:left-0 after:right-0 after:h-px after:bottom-0 after:bg-gray-outline data-[state=active]:after:bg-pink-font"
            >
              <span className="relative z-[1]">
                <TranslatedText translationKey="events" />
              </span>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="community" className="mt-0 px-4">
          <ul className="divide-y divide-gray-outline">
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
        </TabsContent>
        <TabsContent value="events" className="mt-0 px-4">
          <ul className="divide-y divide-gray-outline">
            {EVENT_POSTS.map(post => (
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
