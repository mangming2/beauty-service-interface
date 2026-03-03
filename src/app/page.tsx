import Link from "next/link";
import { Metadata } from "next";
import { ArrowRightIcon } from "@/components/common/Icons";
import { ConceptCard } from "@/components/main/ConceptCard";
import { TranslatedText } from "@/components/main/TranslatedText";
import { FormButton } from "@/components/main/FormButton";
import GirlCrush from "@/assets/3d-images/girl-crush.png";
import LovelyFresh from "@/assets/3d-images/lovely-fresh.png";
import ElegantGlam from "@/assets/3d-images/elegant-glam.png";
import Dreamy from "@/assets/3d-images/dreamy.png";
import Highteen from "@/assets/3d-images/highteen.png";
import Etc from "@/assets/3d-images/etc.png";
import All from "@/assets/3d-images/doki-all.png";
import { GapY } from "@/components/ui/gap";
import { PopularCarousel } from "@/components/main/PopularCarousel";
import { ConceptScrollContainer } from "@/components/main/ConceptScrollContainer";
import { LatestTrendsSection } from "@/components/main/LatestTrendsSection";

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
      <GapY size={24} />
      {/* Main Content */}
      {/* Most Popular Section */}
      <PopularCarousel
        items={[
          {
            imageSrc: "/aespa-1.jpg",
            alt: "Futuristic Chic Idol Debut",
            tags: "#aespa #metallic #sm",
            location: "Songdo, Incheon",
          },
          {
            imageSrc: "/aespa-2.jpg",
            alt: "Metallic Concept",
            tags: "#aespa #metallic #sm",
            location: "Songdo, Incheon",
          },
          {
            imageSrc: "/dummy-profile.png",
            alt: "Concept 3",
            tags: "#kpop #idol #debut",
            location: "Seoul",
          },
        ]}
      />
      <div className="px-5">
        <GapY size={20} />

        {/* CTA Banner */}
        <FormButton />

        <GapY size={20} />

        {/* Choose Your Concept Section */}
        <div className="flex flex-col gap-[14px]">
          <h2 className="title-md">
            <TranslatedText translationKey="chooseConcept" />
          </h2>
          <ConceptScrollContainer>
            {[
              {
                src: All,
                alt: "All",
                labelKey: "concepts.all",
                tags: ["All"],
              },
              {
                src: GirlCrush,
                alt: "Girl Crush",
                labelKey: "concepts.girlCrush",
                tags: ["Girl crush"],
              },
              {
                src: LovelyFresh,
                alt: "Lovely & Fresh",
                labelKey: "concepts.lovelyFresh",
                tags: ["Lovely & Fresh"],
              },
              {
                src: ElegantGlam,
                alt: "Elegant & Glam",
                labelKey: "concepts.elegantGlam",
                tags: ["Elegant & Glam"],
              },
              {
                src: Dreamy,
                alt: "Dreamy",
                labelKey: "concepts.dreamy",
                tags: ["Dreamy"],
              },
              {
                src: Highteen,
                alt: "Highteen",
                labelKey: "concepts.highteen",
                tags: ["Highteen"],
              },
              {
                src: Etc,
                alt: "Etc",
                labelKey: "concepts.etc",
                tags: ["Etc"],
              },
            ].map((concept, index) => {
              const href =
                concept.tags.length > 0
                  ? `/recommend?tags=${encodeURIComponent(concept.tags.join(","))}`
                  : "/recommend";
              return (
                <ConceptCard
                  key={index}
                  src={concept.src}
                  alt={concept.alt}
                  label={<TranslatedText translationKey={concept.labelKey} />}
                  href={href}
                />
              );
            })}
          </ConceptScrollContainer>
        </div>

        <GapY size={20} />

        {/* Board Section - 최근 게시물 3개 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="title-md">DOKI Now</h2>
            <Link
              href="/board"
              className="text-gray_1 caption-md flex items-center gap-[4px]"
            >
              <TranslatedText translationKey="more" />
              <ArrowRightIcon
                color="#BCBCBC"
                width={3}
                height={7}
                className="size-auto"
              />
            </Link>
          </div>
          <GapY size={8} />
          {[
            { id: "1", title: "커버 댄스 인원 구합니다.", date: "202.01.06" },
            {
              id: "2",
              title: "2026년 도키 가맹 업체 안내",
              date: "25.12.21",
            },
            {
              id: "3",
              title: "2026년 도키 가맹 업체 안내",
              date: "25.12.21",
            },
          ].map(post => (
            <Link
              key={post.id}
              href={`/board/${post.id}`}
              className="flex items-center justify-between py-3 border-b border-gray-outline"
            >
              <div>
                <p className="text-md text-white">{post.title}</p>
                <p className="caption-md text-gray_1 mt-0.5">{post.date}</p>
              </div>
              <ArrowRightIcon
                color="#FFFFFE"
                width={6}
                height={16}
                className="size-auto shrink-0"
              />
            </Link>
          ))}
        </div>

        <GapY size={20} />

        {/* Latest Trends Section */}
        <LatestTrendsSection />
      </div>
    </div>
  );
}
