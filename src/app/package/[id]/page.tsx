"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { GapY } from "../../../components/ui/gap";
import { Divider } from "../../../components/ui/divider";
import KakaoMap from "@/components/common/KakaoMap";

interface PackageDetail {
  id: string;
  title: string;
  location: string;
  description: string;
  imageSrc: string;
  components: PackageComponent[];
  included: string[];
  notIncluded: string[];
  checklist: string[];
  reviews: Review[];
  travelTime: string;
  mapLocation: string;
}

interface PackageComponent {
  id: string;
  title: string;
  location: string;
  description: string;
  imageSrc: string;
}

interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  avatarSrc: string;
}

const packageDetails: Record<string, PackageDetail> = {
  "aespa-futuristic": {
    id: "aespa-futuristic",
    title: "Futuristic & Cyber Chic Idol Debut",
    location: "Songdo, Incheon",
    description:
      "Experience the future of K-pop with cutting-edge cyber styling and futuristic photography.",
    imageSrc: "/dummy-profile.png",
    components: [
      {
        id: "makeover",
        title: "Make Over",
        location: "Salon DOKI (Songdo, Incheon)",
        description:
          "Styled by artists with real K-pop idol experience! Includes full base makeup, eye detail, and volumized",
        imageSrc: "/dummy-profile.png",
      },
      {
        id: "debut",
        title: "Doki Debut",
        location: "Studio HYPE (Songdo, Incheon)",
        description:
          "A private studio designed for K-pop fans, complete with spotlight and stage-style lighting.",
        imageSrc: "/dummy-profile.png",
      },
    ],
    included: [
      "Professional makeup & styling",
      "Futuristic costume rental",
      "Studio photography session",
      "Video recording",
      "Digital photo album",
      "Light refreshments",
    ],
    notIncluded: [
      "Transportation to/from location",
      "Personal accessories",
      "Additional photo prints",
    ],
    checklist: [
      "Bring comfortable shoes for walking",
      "Arrive 15 minutes before appointment",
      "Bring any personal makeup preferences",
      "Have your phone fully charged for photos",
    ],
    reviews: [
      {
        id: "1",
        username: "LoveJimin",
        rating: 5,
        comment: "Fantastic experience!",
        avatarSrc: "/dummy-profile.png",
      },
      {
        id: "2",
        username: "aewinter",
        rating: 5,
        comment: "Highly recommended!",
        avatarSrc: "/dummy-profile.png",
      },
    ],
    travelTime: "About 1.5 hour from the",
    mapLocation: "Seoul",
  },
  "aespa-savage": {
    id: "aespa-savage",
    title: "Girl Crush Idol Debut",
    location: "Songdo, Incheon",
    description:
      "Channel your inner girl crush with bold styling and powerful photography.",
    imageSrc: "/dummy-profile.png",
    components: [
      {
        id: "makeover",
        title: "Make Over",
        location: "Salon DOKI (Songdo, Incheon)",
        description:
          "Styled by artists with real K-pop idol experience! Includes full base makeup, eye detail, and volumized",
        imageSrc: "/dummy-profile.png",
      },
      {
        id: "debut",
        title: "Doki Debut",
        location: "Studio HYPE (Songdo, Incheon)",
        description:
          "A private studio designed for K-pop fans, complete with spotlight and stage-style lighting.",
        imageSrc: "/dummy-profile.png",
      },
    ],
    included: [
      "Professional makeup & styling",
      "Girl crush costume rental",
      "Studio photography session",
      "Video recording",
      "Digital photo album",
      "Light refreshments",
    ],
    notIncluded: [
      "Transportation to/from location",
      "Personal accessories",
      "Additional photo prints",
    ],
    checklist: [
      "Bring comfortable shoes for walking",
      "Arrive 15 minutes before appointment",
      "Bring any personal makeup preferences",
      "Have your phone fully charged for photos",
    ],
    reviews: [
      {
        id: "1",
        username: "LoveJimin",
        rating: 5,
        comment: "Fantastic experience!",
        avatarSrc: "/dummy-profile.png",
      },
      {
        id: "2",
        username: "aewinter",
        rating: 5,
        comment: "Highly recommended!",
        avatarSrc: "/dummy-profile.png",
      },
    ],
    travelTime: "About 1.5 hour from the",
    mapLocation: "Seoul",
  },
};

export default function PackageDetail() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;
  const packageDetail = packageDetails[packageId];

  // State for collapsible sections
  const [isIncludedExpanded, setIsIncludedExpanded] = useState(false);
  const [isChecklistExpanded, setIsChecklistExpanded] = useState(false);

  if (!packageDetail) {
    return (
      <div className="min-h-screen text-white bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-4">Package not found</h1>
          <Button onClick={() => router.push("/form/complete")}>
            Go back to packages
          </Button>
        </div>
      </div>
    );
  }

  const handleBook = () => {
    router.push(`/booking/${packageDetail.id}/check`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-600"}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen text-white">
      {/* Main Package Image */}
      <div className="relative w-full h-[412px]">
        <Image
          src={packageDetail.imageSrc}
          alt={packageDetail.title}
          fill
          className="object-cover"
        />
      </div>

      <GapY size={8} />

      {/* Contents : 제목 ~ 지도까지지 */}
      <div className="flex flex-col px-5 py-4">
        {/* Package Title and Location */}
        <div>
          <h1 className="title-md">{packageDetail.title}</h1>
          <p className="text-gray_1 text-md">{packageDetail.location}</p>
        </div>

        <GapY size={12} />

        {/* Package Details Section */}
        <div>
          <h2 className="text-lg ">Package Details</h2>
          {/* Package Components */}
          <div className="flex flex-col w-full">
            {packageDetail.components.map(component => (
              <div key={component.id}>
                <Card className="bg-transparent border-none py-1">
                  <CardContent className="px-0 py-2">
                    <div className="flex gap-1 items-center">
                      <div className="relative w-[80px] h-[80px] overflow-hidden flex-shrink-0">
                        <Image
                          src={component.imageSrc}
                          alt={component.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-1">
                          {component.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-1">
                          {component.location}
                        </p>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {component.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Divider />
              </div>
            ))}
          </div>

          {/* Collapsible Sections */}
          <div className="flex flex-col gap-2">
            {/* Included & Not Included Section */}
            <div className="bg-gray-container rounded-lg overflow-hidden">
              <button
                className="flex items-center justify-between w-full p-4 h-[44px] hover:bg-gray-700 transition-colors"
                onClick={() => setIsIncludedExpanded(!isIncludedExpanded)}
              >
                <span className="font-semibold">Included & Not Included</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transform transition-transform ${isIncludedExpanded ? "rotate-180" : ""}`}
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isIncludedExpanded && (
                <div className="px-4 pb-4">
                  {/* Included Section */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-semibold text-white">
                        ✅ Included
                      </span>
                    </div>
                    <div className="space-y-2 ml-6">
                      <div className="text-sm text-gray-300">
                        - Girl group outfit, shoes, and accessories
                      </div>
                      <div className="text-sm text-gray-300">
                        - Hair styling
                      </div>
                      <div className="text-sm text-gray-300">- Makeup</div>
                      <div className="text-sm text-gray-300">
                        - Photo shoot session
                      </div>
                    </div>
                  </div>

                  {/* Not Included Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-semibold text-white">
                        ❌ Not Included (Please prepare separately)
                      </span>
                    </div>
                    <div className="space-y-1 ml-6 text-sm text-gray-300">
                      <div>Transportation to the studio</div>
                      <div>Any items or services not listed above</div>
                      <div>Travel insurance</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Booking Checklist Section */}
            <div className="bg-gray-container rounded-lg overflow-hidden">
              <button
                className="flex items-center justify-between w-full p-4 h-[44px] hover:bg-gray-700 transition-colors"
                onClick={() => setIsChecklistExpanded(!isChecklistExpanded)}
              >
                <span className="font-semibold">Booking Checklist</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transform transition-transform ${isChecklistExpanded ? "rotate-180" : ""}`}
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isChecklistExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  {packageDetail.checklist.map((item, index) => (
                    <div key={index} className="text-sm text-gray-300">
                      • {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <GapY size={20} />

          {/* Customer Reviews */}
          <div>
            <span className="flex items-center h-11 title-md font-bold mb-4">
              Customers review
            </span>
            <div className="flex flex-nowrap gap-3 overflow-x-auto scrollbar-hide">
              {packageDetail.reviews.map(review => (
                <Card
                  key={review.id}
                  className="w-[250px] h-[132px] flex-shrink-0 p-[14px] bg-gray-container border-none text-white"
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-container overflow-hidden">
                        <Image
                          src={review.avatarSrc}
                          alt={review.username}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{review.username}</p>
                        <div className="flex text-xs">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <GapY size={20} />

          {/* Map Section */}
          <div>
            <KakaoMap address="사당동 142-38" height="192px" className="mb-3" />

            {/* Distance Info */}
            <div className="flex items-center justify-center w-full h-[28px] bg-white/10 rounded-[32px]">
              <span className="text-gray-300 text-sm">
                {packageDetail.travelTime} from the{" "}
                <span className="text-pink-400 font-medium">
                  {packageDetail.mapLocation}
                </span>{" "}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Footer */}
      <div className="bg-transparent px-4 py-4 border-t border-gray-container">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white font-semibold">₩ 170,000 / person</p>
            <p className="text-gray-400 text-sm">25.07.14 - 25.07.22</p>
          </div>
          <Button
            className="w-[164px] x-6 py-3 rounded-lg"
            onClick={handleBook}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
