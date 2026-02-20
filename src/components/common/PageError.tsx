"use client";

import Image from "next/image";
import Link from "next/link";
import ErrorLogo from "../../../public/error-logo.png";
import { Button } from "@/components/ui/button";
import { GapY } from "@/components/ui/gap";

interface PageErrorProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  errorDigest?: string;
}

export function PageError({
  title = "Oops!",
  description = "An unexpected error occurred.\nPlease try again later.",
  buttonText = "Back to main page",
  buttonHref = "/",
  errorDigest,
}: PageErrorProps) {
  const descriptionLines = description.split("\n");

  return (
    <div
      className="text-white bg-transparent flex flex-col flex-1 items-center"
      data-page="error"
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-8">
          <Image
            src={ErrorLogo}
            alt="Error"
            width={172}
            height={172}
            className="object-contain"
            priority
          />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-2">{title}</h1>
          <GapY size={24} />
          <p className="text-lg text-white">
            {descriptionLines.map((line, index) => (
              <span key={`${line}-${index}`}>
                {line}
                {index < descriptionLines.length - 1 && <br />}
              </span>
            ))}
          </p>
          {process.env.NODE_ENV === "development" && errorDigest && (
            <p className="text-sm text-gray-400 mt-2">Error ID: {errorDigest}</p>
          )}
        </div>
      </div>

      <div
        className="w-full py-4 px-5"
        style={{
          boxShadow: "inset 0 6px 6px -6px rgba(255, 255, 255, 0.12)",
        }}
      >
        <Link href={buttonHref}>
          <Button variant="default" className="w-full h-12 text-lg font-semibold">
            {buttonText}
          </Button>
        </Link>
      </div>
    </div>
  );
}
