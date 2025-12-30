"use client";

import { useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguageStore, languageLabels, type Language } from "@/lib/store";

export const LanguageSelector = () => {
  const { currentLanguage, setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  // lazy initialization으로 클라이언트 환경인지 확인 (useEffect 없이)
  const [mounted] = useState(() => typeof window !== "undefined");

  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
    setIsOpen(false);
  };

  // 서버와 클라이언트 렌더링을 일치시키기 위해 마운트 전에는 기본값 표시
  const displayLanguage = mounted ? currentLanguage : "Ko";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center justify-center h-6 p-[5px] gap-[5px] bg-gray text-white rounded-full border border-gray-600">
          <div className="flex items-center gap-0.5">
            <Globe width={14} height={14} />
            <span className="text-sm font-medium">{displayLanguage}</span>
          </div>
          <ChevronDown width={14} height={14} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-17 py-1 px-0 bg-[#303035] rounded-[1px] border-none">
        <div className="space-y-1">
          {Object.entries(languageLabels).map(([code, label]) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code as Language)}
              className={`w-full h-5 text-left px-2 text-sm transition-colors ${
                currentLanguage === code
                  ? "bg-pink-font text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <div className="flex items-center">
                <span>{label}</span>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
