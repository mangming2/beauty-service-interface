"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { useInfiniteAdminUsers } from "@/queries/useAdminQueries";

export function AdminUsersPanel() {
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteAdminUsers({ size: 30, query: appliedQuery || undefined });

  const users = useMemo(
    () => (data?.pages ?? []).flatMap(p => p.users),
    [data?.pages]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedQuery(query.trim());
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        유저 목록 (GET /admin/users?cursor&amp;size&amp;query) — 백엔드 구현
        필요
      </p>
      <form onSubmit={handleSearch} className="flex gap-2 flex-wrap">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="이메일 또는 닉네임 검색"
          className="flex-1 min-w-[160px] px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white text-sm"
        />
        <Button type="submit" variant="secondary" size="sm" className="h-10">
          검색
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-10"
          onClick={() => {
            setQuery("");
            setAppliedQuery("");
          }}
        >
          초기화
        </Button>
      </form>

      {isLoading ? (
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      ) : isError ? (
        <p className="text-red-400 text-sm">
          {(error as Error)?.message ?? "유저 목록을 불러올 수 없습니다."}
        </p>
      ) : users.length === 0 ? (
        <p className="text-gray-500 text-sm">조회된 유저가 없습니다.</p>
      ) : (
        <div className="rounded-lg border border-gray-600 overflow-x-auto">
          <table className="w-full text-sm min-w-[360px]">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">이메일</th>
                <th className="text-left p-2">닉네임</th>
                <th className="text-left p-2 hidden sm:table-cell">역할</th>
                <th className="text-left p-2 hidden md:table-cell">
                  최근 로그인
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr
                  key={u.id}
                  className="border-t border-gray-700 hover:bg-gray-800/50"
                >
                  <td className="p-2 text-gray-400">{u.id}</td>
                  <td className="p-2 text-white break-all max-w-[140px]">
                    {u.email}
                  </td>
                  <td className="p-2">{u.nickname}</td>
                  <td className="p-2 text-gray-400 hidden sm:table-cell">
                    {u.role ?? "USER"}
                  </td>
                  <td className="p-2 text-gray-400 text-xs hidden md:table-cell">
                    {(() => {
                      try {
                        return format(
                          parseISO(u.lastLoginAt),
                          "yy.MM.dd HH:mm"
                        );
                      } catch {
                        return u.lastLoginAt;
                      }
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hasNextPage && !isError && (
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
        </Button>
      )}
    </div>
  );
}
