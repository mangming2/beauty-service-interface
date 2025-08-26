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
          className="h-8 px-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full border border-gray-600"
        >
          <Globe className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">
            {languageLabels[currentLanguage]}
          </span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-32 p-1 bg-gray-800 border-gray-600">
        <div className="space-y-1">
          {Object.entries(languageLabels).map(([code, label]) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code as Language)}
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                currentLanguage === code
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
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
