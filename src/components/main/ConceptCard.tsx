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
      <div className="w-[100px] h-[100px] p-[12px] bg-gray rounded-lg flex items-center justify-center overflow-hidden">
        <Image src={src} alt={alt} width={60} height={60} draggable={false} />
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
