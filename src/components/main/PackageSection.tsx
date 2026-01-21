import PackageCard from "@/components/main/PackageCard";

interface Package {
  id: number;
  name: string;
  description: string;
  minPrice: number;
  totalPrice: number;
  tagNames: string[];
}

interface PackageSectionProps {
  title: string;
  packages: Package[];
  onPackageClick?: (packageId: number) => void;
}

export default function PackageSection({
  title,
  packages,
  onPackageClick,
}: PackageSectionProps) {
  return (
    <div className="flex flex-col gap-2 pl-5 bg-gray-container">
      <div className="flex justify-between h-[44px]">
        <h3 className="flex items-center title-md font-medium">{title}</h3>
        <div className="flex flex-col h-full gap-[5px] justify-end pr-5">
          <div className="flex items-center gap-[5px]">
            <span className="text-gray_1 text-sm">more</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pr-5">
        {packages.map(pkg => (
          <PackageCard
            key={pkg.id}
            packageId={pkg.id}
            imageSrc="/dummy-profile.png" // TODO: API에 이미지 필드 추가 시 교체
            imageAlt={pkg.name}
            title={pkg.name}
            tags={pkg.tagNames}
            minPrice={pkg.minPrice}
            onClick={id => onPackageClick?.(id)}
          />
        ))}
      </div>
    </div>
  );
}
