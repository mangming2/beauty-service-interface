import Image, { StaticImageData } from "next/image";

interface ConceptCardProps {
  src: string | StaticImageData;
  alt: string;
  label: string;
}

export function ConceptCard({ src, alt, label }: ConceptCardProps) {
  return (
    <div className="text-center">
      <div className="w-[100px] h-[100px] p-[12px] bg-gray rounded-lg flex items-center justify-center overflow-hidden">
        <Image src={src} alt={alt} width={60} height={60} />
      </div>
      <span className="text-xs">{label}</span>
    </div>
  );
}
