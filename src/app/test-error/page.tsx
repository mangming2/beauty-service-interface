"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestErrorPage() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error("테스트 에러입니다! 에러 페이지를 확인하세요.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">에러 페이지 테스트</h1>
        <p className="text-gray-400">
          아래 버튼을 클릭하면 에러가 발생하고 error.tsx 페이지가 표시됩니다.
        </p>
        <Button
          onClick={() => setShouldError(true)}
          variant="default"
          className="mt-4"
        >
          에러 발생시키기
        </Button>
      </div>
    </div>
  );
}
