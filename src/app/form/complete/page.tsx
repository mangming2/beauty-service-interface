"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightIcon } from "@/components/common/Icons";
import Image from "next/image";

interface PackageData {
  id: string;
  title: string;
  artist: string;
  location: string;
  description: string;
  imageSrc: string;
  tags: string[];
}

const packages: PackageData[] = [
  {
    id: "aespa-futuristic",
    title: "Futuristic & Cyber Ch...",
    artist: "aespa",
    location: "Incheon",
    description: "Futuristic & Cyber Ch...",
    imageSrc: "/dummy-profile.png",
    tags: ["SMent", "Aespa", "Girl crush"],
  },
  {
    id: "aespa-savage",
    title: "Girl Crush Idol debut",
    artist: "aespa",
    location: "Incheon",
    description: "Girl Crush Idol debut",
    imageSrc: "/dummy-profile.png",
    tags: ["SMent", "Aespa", "Girl crush"],
  },
  {
    id: "triples-dreamy",
    title: "Dreamy & Mystic Idol...",
    artist: "tripleS",
    location: "Gapyeong",
    description: "Dreamy & Mystic Idol...",
    imageSrc: "/dummy-profile.png",
    tags: ["SMent", "tripleS", "Dreamy"],
  },
  {
    id: "blackpink-romantic",
    title: "Romantic & Elegant i...",
    artist: "Black pink",
    location: "Yongin",
    description: "Romantic & Elegant i...",
    imageSrc: "/dummy-profile.png",
    tags: ["YG", "Black pink", "Elegant"],
  },
  {
    id: "aespa-retro",
    title: "Retro & Kitsch Idol D...",
    artist: "aespa",
    location: "Gwangju",
    description: "Retro & Kitsch Idol D...",
    imageSrc: "/dummy-profile.png",
    tags: ["SMent", "Aespa", "Retro"],
  },
  {
    id: "newjeans-y2k",
    title: "Y2K & High-Teen Ido...",
    artist: "NewJeans",
    location: "Yongin",
    description: "Y2K & High-Teen Ido...",
    imageSrc: "/dummy-profile.png",
    tags: ["ADOR", "NewJeans", "Highteen"],
  },
];

const sections = [
  {
    title: "Check out this package!",
    packages: packages.slice(0, 2),
  },
  {
    title: "How about this package?",
    packages: packages.slice(2, 4),
  },
  {
    title: "Looking for another date?",
    packages: packages.slice(4, 6),
  },
];

export default function FormComplete() {
  const [formData, setFormData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // localStorage에서 폼 데이터 가져오기
    const concepts = JSON.parse(
      localStorage.getItem("selectedConcepts") || "[]"
    );
    const favoriteIdol = localStorage.getItem("favoriteIdol") || "";
    const dateRange = JSON.parse(
      localStorage.getItem("selectedDateRange") || "{}"
    );
    const region = localStorage.getItem("selectedRegion") || "";

    setFormData({
      concepts,
      favoriteIdol,
      dateRange,
      region,
    });
  }, []);

  const handleBack = () => {
    router.push("/");
  };

  const handlePackageClick = (packageId: string) => {
    // 패키지 상세 페이지로 이동
    router.push(`/package/${packageId}`);
  };

  return (
    <div className="min-h-screen text-white bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="p-0 h-auto"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5 12.5L5.5 8L10.5 3.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        <h1 className="text-lg font-semibold">My Idol Form</h1>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      <div className="px-4 py-6">
        {/* Tags Section */}
        <div className="mb-6">
          <h2 className="text-sm font-medium mb-3">All summed up in tags</h2>
          <div className="flex gap-2 flex-wrap">
            {formData?.concepts.map((concept: string, index: number) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                {concept}
              </Badge>
            ))}
            {formData?.favoriteIdol && (
              <Badge
                variant="secondary"
                className="bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                {formData.favoriteIdol}
              </Badge>
            )}
          </div>
        </div>

        {/* Package Sections */}
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-0 h-auto"
              >
                <span className="text-sm">more</span>
                <ArrowRightIcon
                  color="currentColor"
                  width={12}
                  height={12}
                  className="ml-1"
                />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {section.packages.map(pkg => (
                <Card
                  key={pkg.id}
                  className="bg-gray-900 border-gray-700 hover:border-pink-500 transition-colors cursor-pointer"
                  onClick={() => handlePackageClick(pkg.id)}
                >
                  <CardContent className="p-0">
                    <div className="relative w-full h-32">
                      <Image
                        src={pkg.imageSrc}
                        alt={pkg.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-gray-400 mb-1">
                        - {pkg.artist} · {pkg.location}
                      </p>
                      <p className="text-sm font-medium text-white">
                        {pkg.title}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
