"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "@/components/common/Icons";
import Image from "next/image";
import { format } from "date-fns";

interface BookingHistory {
  id: string;
  packageTitle: string;
  date: string;
  time: string;
  status: "confirmed" | "completed" | "cancelled";
  imageSrc: string;
  price: number;
}

export default function MyPage() {
  const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([]);
  const [userProfile, setUserProfile] = useState({
    name: "K-pop Fan",
    email: "fan@example.com",
    avatar: "/dummy-profile.png",
  });

  useEffect(() => {
    // localStorage에서 예약 정보 가져오기
    const savedDate = localStorage.getItem("selectedBookingDate");
    const savedTime = localStorage.getItem("selectedBookingTime");
    const selectedConcepts = JSON.parse(
      localStorage.getItem("selectedConcepts") || "[]"
    );
    const favoriteIdol = localStorage.getItem("favoriteIdol") || "";

    if (savedDate && savedTime) {
      const newBooking: BookingHistory = {
        id: "1",
        packageTitle: "Futuristic & Cyber Chic Idol Debut",
        date: format(new Date(savedDate), "yyyy.MM.dd"),
        time: savedTime,
        status: "confirmed",
        imageSrc: "/dummy-profile.png",
        price: 170000,
      };
      setBookingHistory([newBooking]);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "completed":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen text-white bg-black">
      {/* Header */}
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-2">My Page</h1>
        <p className="text-gray-400">Welcome back, {userProfile.name}!</p>
      </div>

      {/* Profile Section */}
      <div className="px-4 mb-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={userProfile.avatar}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{userProfile.name}</h2>
                <p className="text-gray-400 text-sm">{userProfile.email}</p>
              </div>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking History */}
      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Booking History</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white p-0 h-auto"
          >
            <span className="text-sm">View all</span>
            <ArrowRightIcon
              color="currentColor"
              width={12}
              height={12}
              className="ml-1"
            />
          </Button>
        </div>

        {bookingHistory.length > 0 ? (
          <div className="space-y-3">
            {bookingHistory.map(booking => (
              <Card key={booking.id} className="bg-gray-900 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={booking.imageSrc}
                        alt={booking.packageTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-white">
                          {booking.packageTitle}
                        </h3>
                        <Badge
                          className={`${getStatusColor(booking.status)} text-white text-xs`}
                        >
                          {getStatusText(booking.status)}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-1">
                        {booking.date} at {booking.time}
                      </p>
                      <p className="text-pink-500 font-semibold">
                        ₩{booking.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6 text-center">
              <p className="text-gray-400 mb-2">No bookings yet</p>
              <Button className="bg-pink-500 hover:bg-pink-600">
                Book Your First Package
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="ghost"
            className="h-16 bg-gray-900 border border-gray-700 hover:bg-gray-800"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">📅</div>
              <span className="text-sm">My Schedule</span>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="h-16 bg-gray-900 border border-gray-700 hover:bg-gray-800"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">💖</div>
              <span className="text-sm">Wishlist</span>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="h-16 bg-gray-900 border border-gray-700 hover:bg-gray-800"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">⚙️</div>
              <span className="text-sm">Settings</span>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="h-16 bg-gray-900 border border-gray-700 hover:bg-gray-800"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">❓</div>
              <span className="text-sm">Help</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Preferences */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-4">Your Preferences</h2>
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400 mb-1">Favorite Concepts</p>
                <div className="flex gap-2 flex-wrap">
                  {JSON.parse(
                    localStorage.getItem("selectedConcepts") || "[]"
                  ).map((concept: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-pink-500/20 text-pink-300 border-pink-500"
                    >
                      {concept}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Favorite Idol</p>
                <p className="text-white">
                  {localStorage.getItem("favoriteIdol") || "Not set"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
