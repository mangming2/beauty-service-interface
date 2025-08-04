import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  LocationIcon,
  CaretDownIcon,
  ArrowRightIcon,
} from "@/components/common/Icons";
import { ConceptCard } from "@/components/main/ConceptCard";
import { TrendCard } from "@/components/main/TrendCard";
import { dreamy, girlcrush, glow, lovely } from "@/assets/3d-images";
import { GapY } from "@/components/ui/gap";
import { Divider } from "@/components/ui/divider";

export default function Home() {
  return (
    <div className="min-h-screen text-white">
      <GapY size={8} />
      {/* Location Selector */}
      <div className="px-[9px] flex justify-between items-center">
        <div className="flex items-center gap-[2px]">
          <LocationIcon color="white" />
          <span className="text-lg">Seoul, South Korea</span>
        </div>
        <CaretDownIcon color="white" />
      </div>

      <GapY size={8} />

      {/* Main Content */}
      <div className="px-[16px]">
        {/* Most Popular Section */}
        <div className="relative rounded-[8px] border border-card-border">
          <div className="absolute top-3 left-3 z-10 bg-black bg-opacity-50 text-white px-2 py-1 rounded caption-sm">
            Most Popular
          </div>
          <div>
            {/* aespa Giselle image */}
            <div className="relative w-full h-[380px]">
              <Image
                src="/dummy-profile.png"
                alt="aespa Giselle Metallic Concept"
                className="object-cover w-full h-full"
                fill
                priority
              />
            </div>
            <div className="flex flex-col gap-[4px] p-[12px]">
              <div className="caption-sm text-primary">
                #aespa #metallic #sm
              </div>
              <div className="text-md">Songdo, Incheon</div>
            </div>
          </div>
        </div>

        <GapY size={12} />

        {/* CTA Banner */}
        <Link href="/form/step1">
          <Button className="w-full bg-pink-500 hover:bg-pink-600 border-0 px-[12px] py-[8px] h-[52px] flex justify-between items-center cursor-pointer">
            <div className="text-md">Discover your K-pop style!</div>
            <div className="flex w-[28px] items-center justify-center py-[6px]">
              <ArrowRightIcon
                color="white"
                width={7}
                height={16}
                className="size-auto"
              />
            </div>
          </Button>
        </Link>

        <Link href="/recommend">나중에 삭제할것</Link>

        <GapY size={12} />

        {/* Choose Your Concept Section */}
        <div className="flex flex-col gap-[14px]">
          <h2 className="title-md">Choose Your Concept</h2>
          <div className="flex gap-[4px] overflow-x-auto pb-2 scrollbar-hide">
            {[
              { src: girlcrush, alt: "Girl Crush", label: "Girl Crush" },
              { src: lovely, alt: "Lovely & Fresh", label: "Lovely & Fresh" },
              { src: glow, alt: "Elegant & Glam", label: "Elegant & Glam" },
              { src: dreamy, alt: "Dreamy", label: "Dreamy" },
            ].map((concept, index) => (
              <ConceptCard
                key={index}
                src={concept.src}
                alt={concept.alt}
                label={concept.label}
              />
            ))}
          </div>
        </div>

        <GapY size={12} />

        {/* Latest Trends Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="title-md">Latest Trends in Korea</h2>
            <div className="flex items-baseline gap-[4px]">
              <Link href="#" className="text-gray_1 caption-md">
                more
              </Link>
              <ArrowRightIcon
                color="#BCBCBC"
                width={3}
                height={7}
                className="size-auto"
              />
            </div>
          </div>

          <GapY size={16} />

          <div className="flex flex-col">
            {[
              {
                title: "Romantic School Idol Debut",
                artist: "Black Pink",
                location: "Yongin",
                description:
                  "Step into soft pink lights. Romantic idol debut come true.",
                imageSrc: "/dummy-profile.png",
              },
              {
                title: "Y2K & Highteen Idol Debut",
                artist: "NewJeans",
                location: "Gwangju",
                description:
                  "Be a teen heartthrob with kitsh, retro, glittery looks.",
                imageSrc: "/dummy-profile.png",
              },
              {
                title: "K-traditional Idol Debut",
                artist: "SUGA of BTS",
                location: "Yongin",
                description:
                  "Flowing silk, soft colors, capture your own timeless beauty in Hanok.",
                imageSrc: "/dummy-profile.png",
              },
            ].map((trend, index, array) => (
              <div key={index}>
                <TrendCard
                  title={trend.title}
                  artist={trend.artist}
                  location={trend.location}
                  description={trend.description}
                  imageSrc={trend.imageSrc}
                />
                {index < array.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
