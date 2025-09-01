"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/common/Icons";

export default function ProfileSetupPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { updateProfile, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 로딩이 완료된 후에만 인증 상태 체크
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setMessage("이름을 입력해주세요.");
      return;
    }

    try {
      setFormLoading(true);
      setMessage("");

      const { error } = await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        birth_date: birthDate || null,
        created_at: new Date().toISOString(),
      });

      if (error) {
        setMessage("프로필 저장 중 오류가 발생했습니다.");
      } else {
        // 프로필 저장 성공 시 즉시 리다이렉트
        router.push("/my");
      }
    } catch (error) {
      setMessage("프로필 저장 중 오류가 발생했습니다.");
      console.error("Profile setup error:", error);
    } finally {
      setFormLoading(false);
    }
  };

  // 로딩 중이거나 인증되지 않은 경우 로딩 표시
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Icons.spinner className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">프로필 설정</h1>
          <p className="mt-2 text-sm text-gray-600">
            서비스 이용을 위한 기본 정보를 입력해주세요
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>
              뷰티 서비스 맞춤 추천을 위한 정보입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">이름 *</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="홍길동"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="010-1234-5678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">생년월일</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                />
              </div>

              {message && (
                <div
                  className={`text-sm p-3 rounded-md ${
                    message.includes("성공")
                      ? "text-green-600 bg-green-50"
                      : "text-red-600 bg-red-50"
                  }`}
                >
                  {message}
                </div>
              )}

              <Button type="submit" disabled={formLoading} className="w-full">
                {formLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.userPlus className="mr-2 h-4 w-4" />
                )}
                프로필 저장
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            나중에 언제든지 수정할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
