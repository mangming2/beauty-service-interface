"use client";

import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightIcon } from "@/components/common/Icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useProductDetail } from "@/queries/useProductQueries";

const PLACEHOLDER_IMAGE = "/dummy-profile.png";
const platformFee = 20000;

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = Number(params.id);
  const isValidId = !isNaN(packageId) && packageId > 0;

  const { data: productDetail, isLoading: productLoading } = useProductDetail(
    isValidId ? packageId : undefined
  );

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    const savedDate = localStorage.getItem("selectedBookingDate");
    const savedTime = localStorage.getItem("selectedBookingTime");

    if (savedDate) {
      setSelectedDate(format(new Date(savedDate), "yyyy.MM.dd"));
    }
    if (savedTime) {
      setSelectedTime(savedTime);
    }
  }, []);

  if (!isValidId) {
    notFound();
  }

  if (productLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
      </div>
    );
  }

  if (!productDetail) {
    notFound();
  }

  const components = productDetail.options.map(opt => ({
    id: String(opt.id),
    title: opt.name,
    price: opt.price,
    location: opt.location,
    description: opt.description,
    imageSrc: PLACEHOLDER_IMAGE,
  }));

  const handleBack = () => {
    router.push(`/package/${packageId}`);
  };

  const handleDateSelection = () => {
    router.push(`/booking/${packageId}/date`);
  };

  const handleCheckout = () => {
    router.push(`/booking/${packageId}/date`);
  };

  return (
    <div className="min-h-screen text-white bg-black">
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
        <div className="w-6" />
      </div>

      <div className="relative w-full h-80">
        <Image
          src={PLACEHOLDER_IMAGE}
          alt={productDetail.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="px-4 py-4">
        <h1 className="text-xl font-bold">{productDetail.name}</h1>
      </div>

      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Package Details</h2>
        <div className="space-y-2">
          {components.map(component => (
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
              <span>₩{productDetail.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

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

      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Package Details</h2>
        <div className="space-y-4">
          {components.map(component => (
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
