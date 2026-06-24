import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface ConceptCardProps {
  src: string | StaticImageData;
  alt: string;
  label: ReactNode;
  href?: string;
}

export function ConceptCard({ src, alt, label, href }: ConceptCardProps) {
  const content = (
    <div className="text-center">
      <div className="w-[100px] h-[100px] p-[12px] bg-gray rounded-[20px] flex items-center justify-center overflow-hidden">
        <div className="relative w-[60px] h-[60px]">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="60px"
            className="object-contain"
            draggable={false}
          />
        </div>
      </div>
      <span className="text-xs">{label}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="cursor-pointer">
        {content}
      </Link>
    );
  }

  return content;
}
