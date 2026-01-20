"use client";

import { useState } from "react";
import { GapY } from "@/components/ui/gap";
import {
  useHealthCheck,
  useTestSignup,
  useTestLogin,
  getStoredToken,
  clearStoredToken,
} from "@/queries/useTestQueries";

interface LogEntry {
  id: number;
  type: "success" | "error" | "info";
  message: string;
  timestamp: string;
}

export default function TestPage() {
  const [seed, setSeed] = useState("qa01");
  const [email, setEmail] = useState("test-qa01@google.com");
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // React Query Hooks
  const healthQuery = useHealthCheck();
  const signupMutation = useTestSignup();
  const loginMutation = useTestLogin();

  const addLog = (type: LogEntry["type"], message: string) => {
    const entry: LogEntry = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toLocaleTimeString("ko-KR"),
    };
    setLogs(prev => [entry, ...prev]);
  };

  // 헬스 체크
  const handleHealthCheck = async () => {
    try {
      const result = await healthQuery.refetch();
      if (result.data) {
        addLog("success", `서버 상태: ${result.data}`);
      } else if (result.error) {
        addLog("error", `헬스 체크 실패: ${result.error.message}`);
      }
    } catch (error) {
      addLog("error", `헬스 체크 실패: ${error}`);
    }
  };

  // 테스트 회원가입
  const handleSignup = () => {
    signupMutation.mutate(seed, {
      onSuccess: data => {
        addLog(
          "success",
          `회원가입 성공 - ID: ${data.userId}, Email: ${data.email}`
        );
        setEmail(data.email);
      },
      onError: error => {
        addLog("error", `회원가입 실패: ${error.message}`);
      },
    });
  };

  // 테스트 로그인
  const handleLogin = () => {
    loginMutation.mutate(email, {
      onSuccess: data => {
        addLog(
          "success",
          `로그인 성공 - Token: ${data.accessToken?.slice(0, 20)}...`
        );
      },
      onError: error => {
        addLog("error", `로그인 실패: ${error.message}`);
      },
    });
  };

  // 토큰 확인
  const handleCheckToken = () => {
    const token = getStoredToken();
    if (token) {
      addLog("info", `저장된 토큰: ${token.slice(0, 30)}...`);
    } else {
      addLog("info", "저장된 토큰 없음");
    }
  };

  // 토큰 삭제
  const handleClearToken = () => {
    clearStoredToken();
    addLog("info", "토큰 삭제 완료");
  };

  // 로그 초기화
  const clearLogs = () => setLogs([]);

  // 로딩 상태
  const isHealthLoading = healthQuery.isFetching;
  const isSignupLoading = signupMutation.isPending;
  const isLoginLoading = loginMutation.isPending;

  return (
    <div className="min-h-screen text-white p-5">
      <GapY size={24} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">🧪 개발 테스트 페이지</h1>
        <p className="text-gray_1 mt-2">API 연동 테스트용 페이지입니다.</p>
      </div>

      {/* Health Check Section */}
      <section className="mb-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">🏥 서버 상태 확인</h2>
        <button
          onClick={handleHealthCheck}
          disabled={isHealthLoading}
          className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
        >
          {isHealthLoading ? "확인 중..." : "Health Check"}
        </button>
      </section>

      {/* Signup Section */}
      <section className="mb-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">📝 테스트 회원가입</h2>
        <div className="mb-3">
          <label className="block text-sm text-gray_1 mb-1">Seed</label>
          <input
            type="text"
            value={seed}
            onChange={e => setSeed(e.target.value)}
            placeholder="qa01"
            className="w-full p-3 bg-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray_1 mt-1">
            생성될 이메일: test-{seed}@google.com
          </p>
        </div>
        <button
          onClick={handleSignup}
          disabled={isSignupLoading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
        >
          {isSignupLoading ? "가입 중..." : "회원가입"}
        </button>
      </section>

      {/* Login Section */}
      <section className="mb-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">🔐 테스트 로그인</h2>
        <div className="mb-3">
          <label className="block text-sm text-gray_1 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="test-qa01@google.com"
            className="w-full p-3 bg-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleLogin}
          disabled={isLoginLoading}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
        >
          {isLoginLoading ? "로그인 중..." : "로그인"}
        </button>
      </section>

      {/* Token Management */}
      <section className="mb-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">🔑 토큰 관리</h2>
        <div className="flex gap-3">
          <button
            onClick={handleCheckToken}
            className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors"
          >
            토큰 확인
          </button>
          <button
            onClick={handleClearToken}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
          >
            토큰 삭제
          </button>
        </div>
      </section>

      {/* Logs Section */}
      <section className="p-4 bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">📋 로그</h2>
          <button
            onClick={clearLogs}
            className="text-sm text-gray_1 hover:text-white"
          >
            초기화
          </button>
        </div>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {logs.length === 0 ? (
            <p className="text-gray_1 text-center py-4">로그가 없습니다.</p>
          ) : (
            logs.map(log => (
              <div
                key={log.id}
                className={`p-3 rounded-lg text-sm ${
                  log.type === "success"
                    ? "bg-green-900/50 text-green-300"
                    : log.type === "error"
                      ? "bg-red-900/50 text-red-300"
                      : "bg-blue-900/50 text-blue-300"
                }`}
              >
                <span className="text-xs opacity-70">[{log.timestamp}]</span>{" "}
                {log.message}
              </div>
            ))
          )}
        </div>
      </section>

      <GapY size={44} />
    </div>
  );
}
