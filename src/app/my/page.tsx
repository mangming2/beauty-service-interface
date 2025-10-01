"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Icons } from "@/components/common/Icons";
import Image from "next/image";
import { format, parse, differenceInCalendarDays } from "date-fns";
import { useRouter } from "next/navigation";

import { useUser, useSignOut } from "@/hooks/useAuthQueries";

interface BookingHistory {
  id: string;
  packageTitle: string;
  date: string;
  time: string;
  status: "confirmed" | "completed" | "cancelled";
  imageSrc: string;
  price: number;
  location?: string;
  guests?: number;
}

interface Review {
  id: string;
  packageTitle: string;
  date: string;
  rating: number;
  comment: string;
  imageSrc: string;
  location: string;
  reviewed: boolean;
}

export default function MyPage() {
  // React Query hooks 사용
  const { data: user, isLoading: userLoading } = useUser();
  const signOutMutation = useSignOut();
  const router = useRouter();

  const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  // 사용자 정보가 있으면 사용하고, 없으면 기본값 사용
  const userProfile = {
    name:
      user?.user_metadata?.full_name ||
      user?.email?.split("@")[0] ||
      "K-pop Fan",
    email: user?.email || "fan@example.com",
    avatar: user?.user_metadata?.avatar_url || "/dummy-profile.png",
  };

  useEffect(() => {
    const newBooking: BookingHistory = {
      id: "1",
      packageTitle: "Futuristic Chic Idol Debut",
      date: format(new Date(), "yyyy.MM.dd"),
      time: format(new Date(), "HH:mm"),
      status: "confirmed",
      imageSrc: "/dummy-profile.png",
      price: 170000,
      location: "Songdo, Incheon",
      guests: 2,
    };
    setBookingHistory([newBooking]);

    // Add multiple booking history entries for demonstration
    const additionalBookings: BookingHistory[] = [
      {
        id: "2",
        packageTitle: "Futuristic Chic Idol Debut",
        date: "2026.08.15",
        time: "14:00",
        status: "confirmed",
        imageSrc: "/dummy-profile.png",
        price: 170000,
        location: "Songdo, Incheon",
        guests: 2,
      },
      {
        id: "3",
        packageTitle: "Elegant Glam Photo Shoot",
        date: "2026.09.20",
        time: "16:00",
        status: "confirmed",
        imageSrc: "/dummy-profile.png",
        price: 150000,
        location: "Gangnam, Seoul",
        guests: 1,
      },
      {
        id: "4",
        packageTitle: "Girl Crush Concept",
        date: "2026.10.05",
        time: "13:00",
        status: "confirmed",
        imageSrc: "/dummy-profile.png",
        price: 180000,
        location: "Hongdae, Seoul",
        guests: 3,
      },
      {
        id: "5",
        packageTitle: "Futuristic Chic Idol Debut",
        date: "2025.07.14",
        time: "14:00",
        status: "completed",
        imageSrc: "/dummy-profile.png",
        price: 170000,
        location: "Songdo, Incheon",
        guests: 2,
      },
      {
        id: "6",
        packageTitle: "Lovely Fresh Style",
        date: "2025.05.22",
        time: "11:00",
        status: "completed",
        imageSrc: "/dummy-profile.png",
        price: 140000,
        location: "Myeongdong, Seoul",
        guests: 2,
      },
      {
        id: "7",
        packageTitle: "Highteen Concept",
        date: "2025.03.10",
        time: "15:30",
        status: "completed",
        imageSrc: "/dummy-profile.png",
        price: 160000,
        location: "Itaewon, Seoul",
        guests: 1,
      },
    ];

    setBookingHistory([newBooking, ...additionalBookings]);

    // Add reviews
    const reviewData: Review[] = [
      {
        id: "1",
        packageTitle: "Futuristic Chic Idol Debut",
        date: "2025.07.14",
        rating: 5,
        comment: "Amazing experience! The styling was perfect.",
        imageSrc: "/dummy-profile.png",
        location: "Songdo, Incheon",
        reviewed: true,
      },
      {
        id: "2",
        packageTitle: "Futuristic Chic Idol Debut",
        date: "2024.07.14",
        rating: 5,
        comment: "Loved the futuristic concept!",
        imageSrc: "/dummy-profile.png",
        location: "Songdo, Incheon",
        reviewed: true,
      },
    ];

    setReviews(reviewData);
  }, []);

  const getDDayLabel = (dateString: string) => {
    try {
      const date = parse(dateString, "yyyy.MM.dd", new Date());
      const diff = differenceInCalendarDays(date, new Date());
      if (diff > 0) return `D-${diff}`;
      if (diff === 0) return "D-DAY";
      return `D+${Math.abs(diff)}`;
    } catch {
      return "";
    }
  };

  // 사용자 정보 로딩 중일 때
  if (userLoading) {
    return (
      <div className="min-h-screen text-white bg-black flex items-center justify-center">
        <div className="text-lg">사용자 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-black">
      {/* Header with Profile */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={userProfile.avatar}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{userProfile.name}</h1>
            <p className="text-gray-400 text-sm">{userProfile.email}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOutMutation.mutate()}
            disabled={signOutMutation.isPending}
            className="text-gray-400 hover:text-white"
          >
            {signOutMutation.isPending ? "..." : "로그아웃"}
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-4">
        <Tabs defaultValue="my-reviews" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-transparent border-b border-gray-700">
            <TabsTrigger
              value="my-reviews"
              className="relative bg-transparent border-0 text-gray-400 data-[state=active]:text-pink-500 data-[state=active]:bg-transparent hover:text-white transition-colors duration-200 pb-3 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-pink-500"
            >
              My reviews
            </TabsTrigger>
            <TabsTrigger
              value="booking-history"
              className="relative bg-transparent border-0 text-gray-400 data-[state=active]:text-pink-500 data-[state=active]:bg-transparent hover:text-white transition-colors duration-200 pb-3 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-pink-500"
            >
              Booking History
            </TabsTrigger>
          </TabsList>

          {/* My Reviews Tab */}
          <TabsContent value="my-reviews" className="mt-6">
            <div className="space-y-4">
              {reviews.length > 0 ? (
                <>
                  {/* Upcoming Bookings */}
                  <div>
                    <h2 className="text-lg font-bold mb-4">
                      Upcoming Bookings
                    </h2>
                    <div className="flex flex-col gap-1">
                      {bookingHistory
                        .filter(booking => booking.status === "confirmed")
                        .map(booking => (
                          <Card
                            key={booking.id}
                            className="bg-gray-container border-none rounded-1 p-0"
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center">
                                <div className="flex justify-between w-full">
                                  <div className="flex flex-col items-start justify-between">
                                    <h3 className="font-bold text-white text-lg">
                                      DOKI MAKE SALON
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                      <span>
                                        {booking.date} • {booking.time}
                                      </span>{" "}
                                      <span>
                                        ({booking.location?.split(",")[0]})
                                      </span>{" "}
                                      <span>• {booking.guests} Guests</span>
                                    </p>
                                  </div>

                                  <div className="flex items-center px-3 gap-3">
                                    <span className="text-pink-500 font-bold title-lg truncate">
                                      {getDDayLabel(booking.date)}
                                    </span>
                                    <Icons.arrowRight width={6} height={12} />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {/* Completed Reviews */}
                  <div>
                    <h2 className="text-lg font-bold mb-4">Completed</h2>
                    {["2025", "2024"].map(year => (
                      <div key={year} className="mb-6">
                        <h3 className="text-white font-bold mb-3">{year}</h3>
                        {reviews
                          .filter(review => review.date.includes(year))
                          .map(review => (
                            <Card
                              key={review.id}
                              className="bg-gray-900 border-gray-700 mb-3"
                            >
                              <CardContent className="p-4">
                                <div className="flex gap-3">
                                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                      src={review.imageSrc}
                                      alt={review.packageTitle}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-white mb-1">
                                      {review.packageTitle}
                                    </h4>
                                    <p className="text-gray-400 text-sm mb-2">
                                      {review.location}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                      {review.date}
                                    </p>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="bg-gray-800 hover:bg-gray-700 text-gray-300"
                                    >
                                      View Details
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="bg-pink-500 hover:bg-pink-600"
                                    >
                                      Review
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <Card className="bg-gray-900 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-400 mb-2">No reviews yet</p>
                    <Button className="bg-pink-500 hover:bg-pink-600">
                      Book Your First Package
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="booking-history" className="mt-6">
            <div className="space-y-4">
              {/* Booking History List */}
              {["2026", "2025"].map(year => (
                <div key={year} className="mb-6">
                  <h3 className="text-white font-bold mb-3">{year}</h3>
                  {bookingHistory
                    .filter(booking => booking.date.includes(year))
                    .map(booking => (
                      <Sheet key={booking.id}>
                        <SheetTrigger asChild>
                          <Card
                            className={`border-gray-700 mb-3 cursor-pointer transition-all duration-200 ${
                              selectedBooking === booking.id
                                ? "bg-gray-800 border-pink-500"
                                : "bg-gray-900"
                            } hover:bg-gray-800`}
                            onClick={() => setSelectedBooking(booking.id)}
                          >
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
                                  <h4 className="font-semibold text-white mb-1">
                                    {booking.packageTitle}
                                  </h4>
                                  <p className="text-gray-400 text-sm mb-1">
                                    {booking.location}
                                  </p>
                                  <p className="text-gray-400 text-sm">
                                    {booking.date}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </SheetTrigger>
                        <SheetContent
                          side="bottom"
                          className="bg-gray-900 border-gray-700 text-white rounded-t-2xl h-[70vh]"
                        >
                          <SheetHeader className="pb-4">
                            <SheetTitle className="text-white text-lg font-bold">
                              Futuristic Chic Idol Debut
                            </SheetTitle>
                          </SheetHeader>

                          <div className="space-y-4 overflow-y-auto h-full pb-6 relative">
                            <div className="border-l-4 border-pink-500 pl-4">
                              <div className="text-gray-400 text-sm">07.15</div>
                              <div className="text-white font-semibold">
                                Tri-bowl
                              </div>
                              <div className="text-gray-400 text-sm">
                                2 p.m.
                              </div>
                            </div>

                            <div className="border-l-4 border-pink-500 pl-4">
                              <div className="text-white font-semibold">
                                Incheon Bridge Observatory
                              </div>
                              <div className="text-gray-400 text-sm">
                                4 p.m.
                              </div>
                            </div>

                            <div className="border-l-4 border-gray-600 pl-4">
                              <div className="text-gray-400 text-sm">07.16</div>
                              <div className="text-white font-semibold">
                                Salon DOKI
                              </div>
                              <div className="text-gray-400 text-sm">
                                10 a.m.
                              </div>
                            </div>

                            <div className="border-l-4 border-gray-600 pl-4">
                              <div className="text-white font-semibold">
                                Studio HYPE
                              </div>
                              <div className="text-gray-400 text-sm">
                                1 p.m.
                              </div>
                            </div>

                            <div className="border-l-4 border-gray-600 pl-4">
                              <div className="text-white font-semibold">
                                Urban History Museum
                              </div>
                              <div className="text-gray-400 text-sm">
                                5 p.m.
                              </div>
                            </div>

                            {/* Plus Button - Fixed Position */}
                            <Button
                              onClick={() =>
                                router.push(`/my/schedule/${booking.id}`)
                              }
                              className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-pink-500 hover:bg-pink-600 p-0 shadow-lg"
                            >
                              <Icons.plus className="w-6 h-6 text-white" />
                            </Button>
                          </div>
                        </SheetContent>
                      </Sheet>
                    ))}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
