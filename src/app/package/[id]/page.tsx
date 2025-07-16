"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightIcon } from "@/components/common/Icons";
import Image from "next/image";

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

  const handleBack = () => {
    router.push("/form/complete");
  };

  const handleLike = () => {
    console.log("Liked package:", packageDetail.id);
  };

  const handleShare = () => {
    console.log("Sharing package:", packageDetail.id);
  };

  const handleBook = () => {
    router.push(`/booking/${packageDetail.id}`);
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
    <div className="min-h-screen text-white bg-black">
      {/* Header with like and share */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="p-0 h-auto"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5 12.5L5.5 8L10.5 3.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className="p-0 h-auto"
          >
            <svg
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.49902 -0.00927734C2.46142 -0.00927734 -0.000976562 2.45273 -0.000976562 5.49073C-0.000976562 8.67474 1.81252 11.6787 4.81152 14.4287C5.83512 15.3667 6.93723 16.1897 8.03023 16.9287C8.41333 17.1867 8.77163 17.4208 9.09282 17.6158C9.28863 17.7348 9.41773 17.8208 9.49903 17.8658C9.80103 18.0338 10.197 18.0338 10.499 17.8658C10.5803 17.8208 10.7094 17.7348 10.9052 17.6158C11.2264 17.4208 11.5847 17.1867 11.9678 16.9287C13.0608 16.1897 14.1629 15.3667 15.1865 14.4287C18.1855 11.6787 19.999 8.67474 19.999 5.49073C19.999 2.45273 17.5366 -0.00927734 14.499 -0.00927734C12.7738 -0.00927734 11.0894 0.930736 10.0302 2.30274C8.99743 0.906736 7.31893 -0.00927734 5.49902 -0.00927734Z"
                fill="white"
              />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="p-0 h-auto"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 6.66667C16.3807 6.66667 17.5 5.54738 17.5 4.16667C17.5 2.78595 16.3807 1.66667 15 1.66667C13.6193 1.66667 12.5 2.78595 12.5 4.16667C12.5 4.55667 12.5833 4.93333 12.7333 5.26667L8.51667 7.51667C8.05 7.18333 7.51667 7 6.93333 7C5.55262 7 4.43333 8.11929 4.43333 9.5C4.43333 10.8807 5.55262 12 6.93333 12C7.51667 12 8.05 11.8167 8.51667 11.4833L12.7333 13.7333C12.5833 14.0667 12.5 14.4433 12.5 14.8333C12.5 16.214 13.6193 17.3333 15 17.3333C16.3807 17.3333 17.5 16.214 17.5 14.8333C17.5 13.4526 16.3807 12.3333 15 12.3333C14.4167 12.3333 13.8833 12.5167 13.4167 12.85L9.2 10.6C9.35 10.2667 9.43333 9.89 9.43333 9.5C9.43333 9.11 9.35 8.73333 9.2 8.4L13.4167 6.15C13.8833 6.48333 14.4167 6.66667 15 6.66667Z"
                fill="white"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* Main Package Image */}
      <div className="relative w-full h-80">
        <Image
          src={packageDetail.imageSrc}
          alt={packageDetail.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Package Title and Location */}
      <div className="bg-gray-900 px-4 py-3">
        <h1 className="text-xl font-bold mb-1">{packageDetail.title}</h1>
        <p className="text-gray-400 text-sm">{packageDetail.location}</p>
      </div>

      {/* Package Details Section */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-bold mb-4">Package Details</h2>

        {/* Package Components */}
        <div className="space-y-4 mb-6">
          {packageDetail.components.map(component => (
            <Card key={component.id} className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
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
                    <p className="text-gray-300 text-sm">
                      {component.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4 mb-6">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center cursor-pointer">
              <h3 className="font-semibold">Included & Not Included</h3>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center cursor-pointer">
              <h3 className="font-semibold">Booking Checklist</h3>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4">Customers review</h3>
          <div className="grid grid-cols-2 gap-3">
            {packageDetail.reviews.map(review => (
              <Card key={review.id} className="bg-gray-900 border-gray-700">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
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

        {/* Map Section */}
        <div className="mb-6">
          <div className="bg-gray-800 rounded-lg h-48 mb-3 flex items-center justify-center">
            <div className="text-center">
              <div className="w-6 h-6 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 1C4.34315 1 3 2.34315 3 4C3 6 6 10 6 10C6 10 9 6 9 4C9 2.34315 7.65685 1 6 1Z"
                    fill="white"
                  />
                  <circle cx="6" cy="4" r="1" fill="red" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">트라이볼</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            {packageDetail.travelTime}{" "}
            <span className="text-pink-500">{packageDetail.mapLocation}</span>
          </p>
        </div>

        {/* Nearby Attractions */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Nearby Attractions</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white p-0 h-auto"
            >
              <span className="text-sm">more</span>
              <ArrowRightIcon
                color="currentColor"
                width={12}
                height={12}
                className="ml-1"
              />
            </Button>
          </div>

          <div className="space-y-3">
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src="/dummy-profile.png"
                      alt="Restaurant"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-1">
                      Karina from aespa ate here
                    </h4>
                    <p className="text-gray-400 text-sm mb-1">
                      restaurant · Songdo, Incheon
                    </p>
                    <p className="text-gray-300 text-sm">
                      Karina visited on [Amazing Saturday]
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src="/dummy-profile.png"
                      alt="Arena"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-1">
                      aespa performed at Inspire Arena
                    </h4>
                    <p className="text-gray-400 text-sm mb-1">
                      arena · Songdo, Incheon
                    </p>
                    <p className="text-gray-300 text-sm">
                      fans have even spotted aespa visiting after shows!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Footer */}
      <div className="bg-gray-900 px-4 py-4 border-t border-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white font-semibold">₩ 170,000 / person</p>
            <p className="text-gray-400 text-sm">25.07.14 - 25.07.22</p>
          </div>
          <Button
            className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-lg"
            onClick={handleBook}
          >
            <span className="font-medium">Book Now</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
