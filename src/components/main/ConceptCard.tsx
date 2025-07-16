import Image, { StaticImageData } from "next/image";

interface ConceptCardProps {
  src: string | StaticImageData;
  alt: string;
  label: string;
  bgColor?: string;
}

export function ConceptCard({
  src,
  alt,
  label,
  bgColor = "bg-gray",
}: ConceptCardProps) {
  return (
    <div className="text-center">
      <div
        className={`w-[100px] h-[100px] px-[20px] py-[18px] ${bgColor} rounded-lg flex items-center justify-center overflow-hidden`}
      >
        <Image
          src={src}
          alt={alt}
          width={48}
          height={48}
          className="object-cover"
        />
      </div>
      <span className="text-xs">{label}</span>
    </div>
  );
}
