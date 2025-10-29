import { ArrowRightIcon } from "@/components/common/Icons";
import PackageCard from "@/components/main/PackageCard";

interface Package {
  id: string;
  title: string;
  artist: string;
  location: string;
  imageSrc: string;
}

interface PackageSectionProps {
  title: string;
  packages: Package[];
  onPackageClick?: (packageId: string) => void;
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
            <ArrowRightIcon width={3} height={7} color="var(--color-gray_1)" />
          </div>
        </div>
      </div>
      {/* Package Cards */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pr-5">
        {packages.map(package_ => (
          <PackageCard
            key={package_.id}
            packageId={package_.id}
            imageSrc={package_.imageSrc}
            imageAlt={`${package_.artist} - ${package_.title}`}
            artist={package_.artist}
            location={package_.location}
            title={package_.title}
            onClick={() => onPackageClick?.(package_.id)}
          />
        ))}
      </div>
    </div>
  );
}
