"use client";

import { useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useLanguageStore, languageLabels, type Language } from "@/lib/store";

export const LanguageSelector = () => {
  const { currentLanguage, setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 px-3 bg-gray text-white rounded-full border border-gray-600"
        >
          <Globe width={14} height={14} />
          <span className="text-sm font-medium">{currentLanguage}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
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
