"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import NotFoundLogo from "../../public/404-logo.png";
import { GapY } from "../components/ui/gap";
import Link from "next/link";
export default function NotFound() {
  return (
    <div
      className="text-white bg-transparent flex flex-col flex-1 items-center"
      data-page="not-found"
    >
      {/* 중앙 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* 404 Logo */}
        <div className="mb-8">
          <Image
            src={NotFoundLogo}
            alt="404 Not Found"
            width={372}
            height={200}
            className="object-contain"
            priority
          />
        </div>

        {/* Error Messages */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-2">Page Not Found</h1>
          <GapY size={24} />
          <p className="text-lg text-white">This page has drifted away.</p>
          <p className="text-lg text-white">
            Let&apos;s get you back on track!
          </p>
        </div>
      </div>

      {/* Back to Login Button */}
      <div
        className="w-full py-4 px-5"
        style={{
          boxShadow: "inset 0 6px 6px -6px rgba(255, 255, 255, 0.12)",
        }}
      >
        <Link href="/">
          <Button
            variant="default"
            className="w-full h-12 text-lg font-semibold"
          >
            Back to main page
          </Button>
        </Link>
      </div>
    </div>
  );
}
