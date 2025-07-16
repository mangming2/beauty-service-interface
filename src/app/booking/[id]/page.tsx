"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightIcon } from "@/components/common/Icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface BookingPackage {
  id: string;
  title: string;
  imageSrc: string;
  components: BookingComponent[];
  totalPrice: number;
}

interface BookingComponent {
  id: string;
  title: string;
  price: number;
  location: string;
  description: string;
  imageSrc: string;
}

const bookingPackages: Record<string, BookingPackage> = {
  "aespa-futuristic": {
    id: "aespa-futuristic",
    title: "Futuristic & Cyber Chic Idol Debut",
    imageSrc: "/dummy-profile.png",
    components: [
      {
        id: "makeup",
        title: "Make-up & Hair",
        price: 70000,
        location: "Salon DOKI (Songdo, Incheon)",
        description:
          "Styled by artists with real K-pop idol experience! Includes full base makeup, eye detail, and volumized",
        imageSrc: "/dummy-profile.png",
      },
      {
        id: "studio",
        title: "Studio Session",
        price: 80000,
        location: "Studio HYPE (Songdo, Incheon)",
        description:
          "A private studio designed for K-pop fans, complete with spotlight and stage-style lighting.",
        imageSrc: "/dummy-profile.png",
      },
    ],
    totalPrice: 170000,
  },
  "aespa-savage": {
    id: "aespa-savage",
    title: "Girl Crush Idol Debut",
    imageSrc: "/dummy-profile.png",
    components: [
      {
        id: "makeup",
        title: "Make-up & Hair",
        price: 70000,
        location: "Salon DOKI (Songdo, Incheon)",
        description:
          "Styled by artists with real K-pop idol experience! Includes full base makeup, eye detail, and volumized",
        imageSrc: "/dummy-profile.png",
      },
      {
        id: "studio",
        title: "Studio Session",
        price: 80000,
        location: "Studio HYPE (Songdo, Incheon)",
        description:
          "A private studio designed for K-pop fans, complete with spotlight and stage-style lighting.",
        imageSrc: "/dummy-profile.png",
      },
    ],
    totalPrice: 170000,
  },
};

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;
  const bookingPackage = bookingPackages[packageId];
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    // localStorage에서 선택된 날짜와 시간 가져오기
    const savedDate = localStorage.getItem("selectedBookingDate");
    const savedTime = localStorage.getItem("selectedBookingTime");

    if (savedDate) {
      setSelectedDate(format(new Date(savedDate), "yyyy.MM.dd"));
    }
    if (savedTime) {
      setSelectedTime(savedTime);
    }
  }, []);

  if (!bookingPackage) {
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
    router.push(`/package/${packageId}`);
  };

  const handleDateSelection = () => {
    router.push(`/booking/${packageId}/date`);
  };

  const handleCheckout = () => {
    // 예약 완료 처리
    console.log("Booking completed for package:", packageId);

    // 예약 완료 상태를 localStorage에 저장
    localStorage.setItem("bookingCompleted", "true");

    // 마이페이지로 이동
    router.push("/my");
  };

  const platformFee = 20000;

  return (
    <div className="min-h-screen text-white bg-black">
      {/* Header */}
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
        <h1 className="text-lg font-semibold">Checkout</h1>
        <div className="w-6"></div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-80">
        <Image
          src={bookingPackage.imageSrc}
          alt={bookingPackage.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Package Title */}
      <div className="px-4 py-4">
        <h1 className="text-xl font-bold">{bookingPackage.title}</h1>
      </div>

      {/* Package Details Summary */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Package Details</h2>
        <div className="space-y-2">
          {bookingPackage.components.map(component => (
            <div key={component.id} className="flex justify-between">
              <span className="text-gray-300">{component.title}</span>
              <span className="text-white">
                ₩{component.price.toLocaleString()}
              </span>
            </div>
          ))}
          <div className="flex justify-between">
            <span className="text-gray-300">Platform Fee</span>
            <span className="text-white">₩{platformFee.toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-700 pt-2 mt-2">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₩{bookingPackage.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Date */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Booking Date</h2>
        <Button
          variant="ghost"
          className="w-full justify-between p-4 bg-gray-900 border border-gray-700 hover:bg-gray-800"
          onClick={handleDateSelection}
        >
          <span className={selectedDate ? "text-white" : "text-gray-300"}>
            {selectedDate
              ? `${selectedDate} ${selectedTime}`
              : "Choose your date"}
          </span>
          <ArrowRightIcon
            color="white"
            width={12}
            height={12}
            className="size-auto"
          />
        </Button>
      </div>

      {/* Package Details */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Package Details</h2>
        <div className="space-y-4">
          {bookingPackage.components.map(component => (
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
      </div>

      {/* Included & Not Included */}
      <div className="px-4 mb-6">
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
      </div>

      {/* Checkout Button */}
      <div className="px-4 py-4 bg-black border-t border-gray-800">
        <Button
          className="w-full bg-pink-500 hover:bg-pink-600 h-[52px]"
          onClick={handleCheckout}
        >
          <span className="font-medium">Checkout</span>
        </Button>
      </div>
    </div>
  );
}
