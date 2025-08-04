import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  LocationIcon,
  CaretDownIcon,
  ArrowRightIcon,
} from "@/components/common/Icons";
import { GapY } from "@/components/ui/gap";
import { Divider } from "@/components/ui/divider";

export default function RecommendPage() {
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
        {/* Tags Section */}
        <div className="flex flex-col gap-[14px]">
          <div className="flex justify-between items-center">
            <h2 className="title-md">All summed up in tags</h2>
            <div className="w-[32px] h-[32px] bg-pink-500 rounded-lg flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.7167 4.51667L11.4833 4.28333L12.7167 3.05C12.8 2.96667 12.9167 2.91667 13.05 2.91667C13.1833 2.91667 13.3 2.96667 13.3833 3.05L13.95 3.61667C14.0333 3.7 14.0833 3.81667 14.0833 3.95C14.0833 4.08333 14.0333 4.2 13.95 4.28333L11.7167 4.51667ZM10.7167 5.51667L10.4833 5.28333L2.71667 13.05V15.2833H4.95L12.7167 7.51667L12.4833 7.28333L10.7167 5.51667Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
          <div className="flex gap-[8px] overflow-x-auto pb-2 scrollbar-hide">
            {["SMent", "Aespa", "Girl crush", "Metallic"].map((tag, index) => (
              <div
                key={index}
                className="px-[12px] py-[6px] bg-gray-800 rounded-lg text-white text-sm whitespace-nowrap"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        <GapY size={16} />

        {/* Check out this package Section */}
        <div className="flex flex-col gap-[14px]">
          <div className="flex justify-between items-center">
            <h2 className="title-md">Check out this package!</h2>
            <Link
              href="#"
              className="flex items-center gap-[4px] text-gray_1 caption-md"
            >
              more
              <ArrowRightIcon
                color="#BCBCBC"
                width={3}
                height={7}
                className="size-auto"
              />
            </Link>
          </div>
          <div className="flex gap-[8px] overflow-x-auto pb-2 scrollbar-hide">
            {[
              {
                title: "Futuristic & Cyber C...",
                artist: "aespa",
                location: "Incheon",
                imageSrc: "/dummy-profile.png",
              },
              {
                title: "Girl Crush Idol debut",
                artist: "aespa",
                location: "Incheon",
                imageSrc: "/dummy-profile.png",
              },
            ].map((package_, index) => (
              <div key={index} className="flex-shrink-0 w-[160px]">
                <div className="relative w-full h-[120px] bg-gray rounded-lg overflow-hidden mb-[8px]">
                  <Image
                    src={package_.imageSrc}
                    alt={package_.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-xs text-gray-400">
                  - {package_.artist} - {package_.location}
                </div>
                <div className="text-sm text-white font-medium">
                  {package_.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        <GapY size={16} />

        {/* How about this package Section */}
        <div className="flex flex-col gap-[14px]">
          <div className="flex justify-between items-center">
            <h2 className="title-md">How about this package?</h2>
            <Link
              href="#"
              className="flex items-center gap-[4px] text-gray_1 caption-md"
            >
              more
              <ArrowRightIcon
                color="#BCBCBC"
                width={3}
                height={7}
                className="size-auto"
              />
            </Link>
          </div>
          <div className="flex gap-[8px] overflow-x-auto pb-2 scrollbar-hide">
            {[
              {
                title: "Dreamy & Mystic Idol...",
                artist: "tripleS",
                location: "Gapyeong",
                imageSrc: "/dummy-profile.png",
              },
              {
                title: "Romantic & Elegant i...",
                artist: "Blackpink",
                location: "Yongin",
                imageSrc: "/dummy-profile.png",
              },
            ].map((package_, index) => (
              <div key={index} className="flex-shrink-0 w-[160px]">
                <div className="relative w-full h-[120px] bg-gray rounded-lg overflow-hidden mb-[8px]">
                  <Image
                    src={package_.imageSrc}
                    alt={package_.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-xs text-gray-400">
                  - {package_.artist} - {package_.location}
                </div>
                <div className="text-sm text-white font-medium">
                  {package_.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        <GapY size={16} />

        {/* Looking for another date Section */}
        <div className="flex flex-col gap-[14px]">
          <div className="flex justify-between items-center">
            <h2 className="title-md">Looking for another date?</h2>
            <Link
              href="#"
              className="flex items-center gap-[4px] text-gray_1 caption-md"
            >
              more
              <ArrowRightIcon
                color="#BCBCBC"
                width={3}
                height={7}
                className="size-auto"
              />
            </Link>
          </div>
          <div className="flex gap-[8px] overflow-x-auto pb-2 scrollbar-hide">
            {[
              {
                title: "HITST Special Package",
                artist: "HITST",
                location: "Seoul",
                imageSrc: "/dummy-profile.png",
              },
              {
                title: "Summer Vibes Package",
                artist: "Various",
                location: "Busan",
                imageSrc: "/dummy-profile.png",
              },
            ].map((package_, index) => (
              <div key={index} className="flex-shrink-0 w-[160px]">
                <div className="relative w-full h-[120px] bg-gray rounded-lg overflow-hidden mb-[8px]">
                  <Image
                    src={package_.imageSrc}
                    alt={package_.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-xs text-gray-400">
                  - {package_.artist} - {package_.location}
                </div>
                <div className="text-sm text-white font-medium">
                  {package_.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        <GapY size={20} />

        {/* CTA Button */}
        <Link href="/form/step1">
          <Button className="w-full bg-pink-500 hover:bg-pink-600 border-0 px-[12px] py-[8px] h-[52px] flex justify-between items-center cursor-pointer">
            <div className="text-md">Book your perfect package!</div>
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
      </div>
    </div>
  );
}
