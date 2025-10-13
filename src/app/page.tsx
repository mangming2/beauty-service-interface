import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ArrowRightIcon } from "@/components/common/Icons";
import { ConceptCard } from "@/components/main/ConceptCard";
import { TrendCard } from "@/components/main/TrendCard";
import { TranslatedText } from "@/components/main/TranslatedText";
import { FormButton } from "@/components/main/FormButton";
import GirlCrush from "@/assets/3d-images/girl-crush.png";
import LovelyFresh from "@/assets/3d-images/lovely-fresh.png";
import ElegantGlam from "@/assets/3d-images/elegant-glam.png";
import Dreamy from "@/assets/3d-images/dreamy.png";
import Highteen from "@/assets/3d-images/highteen.png";
import Etc from "@/assets/3d-images/etc.png";
import { GapY } from "@/components/ui/gap";
import { Divider } from "@/components/ui/divider";
import { Loading } from "../components/common";

export const generateMetadata = (): Metadata => {
  return {
    title: "DOKI - 뷰티 스타일 발견하기",
    description: "나만의 뷰티 스타일을 발견하고 예약하세요.",
    openGraph: {
      title: "DOKI - 뷰티 스타일 발견하기",
      description: "나만의 뷰티 스타일을 발견하고 예약하세요.",
      type: "website",
      locale: "ko_KR",
      siteName: "DOKI",
      images: [
        {
          url: "/main-logo.png",
          width: 1200,
          height: 630,
          alt: "DOKI 뷰티 서비스",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "DOKI - 뷰티 스타일 발견하기",
      description: "나만의 뷰티 스타일을 발견하고 예약하세요.",
      images: ["/main-logo.png"],
    },
  };
};

export default function Home() {
  return (
    <div className="min-h-screen text-white">
      <GapY size={20} />
      {/* Main Content */}
      <div>
        {/* Most Popular Section */}
        <div className="relative rounded-[8px] border border-card-border">
          <div className="absolute top-3 left-3 z-10 bg-black bg-opacity-50 text-white px-2 py-1 rounded caption-sm">
            <TranslatedText translationKey="mostPopular" />
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

        <GapY size={20} />

        {/* CTA Banner */}
        <FormButton />

        <GapY size={20} />

        {/* Choose Your Concept Section */}
        <div className="flex flex-col gap-[14px]">
          <h2 className="title-md">
            <TranslatedText translationKey="chooseConcept" />
          </h2>
          <div className="flex gap-[4px] overflow-x-auto pb-2 scrollbar-hide">
            {[
              {
                src: GirlCrush,
                alt: "Girl Crush",
                labelKey: "concepts.girlCrush",
              },
              {
                src: LovelyFresh,
                alt: "Lovely & Fresh",
                labelKey: "concepts.lovelyFresh",
              },
              {
                src: ElegantGlam,
                alt: "Elegant & Glam",
                labelKey: "concepts.elegantGlam",
              },
              { src: Dreamy, alt: "Dreamy", labelKey: "concepts.dreamy" },
              { src: Highteen, alt: "Highteen", labelKey: "concepts.highteen" },
              { src: Etc, alt: "Etc", labelKey: "concepts.etc" },
            ].map((concept, index) => (
              <ConceptCard
                key={index}
                src={concept.src}
                alt={concept.alt}
                label={<TranslatedText translationKey={concept.labelKey} />}
              />
            ))}
          </div>
        </div>

        <GapY size={20} />

        {/* Latest Trends Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="title-md">
              <TranslatedText translationKey="latestTrends" />
            </h2>
            <div className="flex items-baseline gap-[4px]">
              <Link href="#" className="text-gray_1 caption-md">
                <TranslatedText translationKey="more" />
              </Link>
              <ArrowRightIcon
                color="#BCBCBC"
                width={3}
                height={7}
                className="size-auto"
              />
            </div>
          </div>

          <GapY size={8} />

          <div className="flex flex-col">
            {[
              {
                id: "aespa-futuristic",
                titleKey: "trends.romanticSchool.title",
                artistKey: "trends.romanticSchool.artist",
                locationKey: "trends.romanticSchool.location",
                descriptionKey: "trends.romanticSchool.description",
                imageSrc: "/dummy-profile.png",
              },
              {
                id: "y2k-highteen",
                titleKey: "trends.y2kHighteen.title",
                artistKey: "trends.y2kHighteen.artist",
                locationKey: "trends.y2kHighteen.location",
                descriptionKey: "trends.y2kHighteen.description",
                imageSrc: "/dummy-profile.png",
              },
              {
                id: "k-traditional",
                titleKey: "trends.kTraditional.title",
                artistKey: "trends.kTraditional.artist",
                locationKey: "trends.kTraditional.location",
                descriptionKey: "trends.kTraditional.description",
                imageSrc: "/dummy-profile.png",
              },
            ].map((trend, index, array) => (
              <div key={index}>
                <TrendCard
                  id={trend.id}
                  title={<TranslatedText translationKey={trend.titleKey} />}
                  artist={<TranslatedText translationKey={trend.artistKey} />}
                  location={
                    <TranslatedText translationKey={trend.locationKey} />
                  }
                  description={
                    <TranslatedText translationKey={trend.descriptionKey} />
                  }
                  imageSrc={trend.imageSrc}
                />
                {index < array.length - 1 && <Divider />}
              </div>
            ))}
          </div>
          <GapY size={44} />
        </div>
      </div>
    </div>
  );
}
