"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { useAdminUsers } from "@/queries/useAdminQueries";

export function AdminUsersPanel() {
  const [query, setQuery] = useState("");

  const { data: users = [], isLoading, isError, error } = useAdminUsers();

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      u =>
        u.email.toLowerCase().includes(q) ||
        u.nickname.toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">유저 목록 (GET /admin/users)</p>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="이메일 또는 닉네임 검색"
        className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white text-sm"
      />

      {isLoading ? (
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      ) : isError ? (
        <p className="text-red-400 text-sm">
          {(error as Error)?.message ?? "유저 목록을 불러올 수 없습니다."}
        </p>
      ) : filteredUsers.length === 0 ? (
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
              {filteredUsers.map(u => (
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
                    {u.role}
                  </td>
                  <td className="p-2 text-gray-400 text-xs hidden md:table-cell">
                    {u.lastLoginAt
                      ? (() => {
                          try {
                            return format(
                              parseISO(u.lastLoginAt),
                              "yy.MM.dd HH:mm"
                            );
                          } catch {
                            return u.lastLoginAt;
                          }
                        })()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
