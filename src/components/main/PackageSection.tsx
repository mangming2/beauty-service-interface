import PackageCard from "@/components/main/PackageCard";
import type { Product } from "@/api/product";
import { TranslatedText } from "@/components/main/TranslatedText";
import { getSafeImageSrc } from "@/lib/utils";

interface PackageSectionProps {
  title: string;
  packages: Product[];
  onPackageClick?: (packageId: number) => void;
  onMoreClick?: () => void;
  /** 첫 번째 카드가 LCP일 때 true */
  firstCardPriority?: boolean;
}

export default function PackageSection({
  title,
  packages,
  onPackageClick,
  onMoreClick,
  firstCardPriority = false,
}: PackageSectionProps) {
  return (
    <div className="flex flex-col gap-2 pl-5 bg-gray-container">
      <div className="flex justify-between h-[44px]">
        <h3 className="flex items-center title-md font-medium">{title}</h3>
        <div className="flex flex-col h-full gap-[5px] justify-end pr-5">
          <button onClick={onMoreClick} className="flex items-center gap-[5px]">
            <span className="text-gray_1 text-sm">
              <TranslatedText translationKey="more" />
            </span>
          </button>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pr-5">
        {packages.map((pkg, index) => (
          <PackageCard
            key={pkg.id}
            packageId={pkg.id}
            imageSrc={getSafeImageSrc(
              pkg.imageUrls?.[0] ?? pkg.representOption?.imageUrls?.[0]
            )}
            imageAlt={pkg.name}
            title={pkg.name}
            tags={pkg.representOption?.tags ?? pkg.tagNames ?? []}
            minPrice={
              pkg.representOption?.finalPrice ??
              pkg.totalPrice ??
              pkg.minPrice ??
              0
            }
            onClick={id => onPackageClick?.(id)}
            priority={firstCardPriority && index === 0}
          />
        ))}
      </div>
    </div>
  );
}
