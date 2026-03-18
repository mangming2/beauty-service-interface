import { Metadata } from "next";
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
import { LatestAnnouncementPosts } from "@/components/main/LatestAnnouncementPosts";

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
        <LatestAnnouncementPosts />

        <GapY size={20} />

        {/* Latest Trends Section */}
        <LatestTrendsSection />
      </div>
    </div>
  );
}
