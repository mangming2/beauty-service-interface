import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  LocationIcon,
  ChevronDownIcon,
  ArrowRightIcon,
} from "@/components/common/Icons";
import { dreamy, girlcrush, glow, highteen, lovely } from "@/assets/3d-images";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Location Selector */}
      <div className="bg-gray-800 px-4 py-3 border-t border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <LocationIcon color="white" />
          <span className="text-sm">Seoul, South Korea</span>
        </div>
        <ChevronDownIcon color="white" />
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 space-y-6">
        {/* Most Popular Section */}
        <div className="relative">
          <div className="absolute top-3 left-3 z-10 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            Most Popular
          </div>
          <div className="relative rounded-lg overflow-hidden">
            {/* aespa Giselle image */}
            <div className="relative w-full h-64">
              <Image
                src="https://picsum.photos/200/300"
                alt="aespa Giselle Metallic Concept"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm font-medium">aespa Giselle</p>
                <p className="text-xs text-gray-200">Metallic Concept</p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-90 p-3">
              <div className="text-xs text-gray-300 mb-1">
                #aespa #metallic #sm
              </div>
              <div className="text-xs text-gray-400">Songdo, Incheon</div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <Button className="w-full bg-pink-500 hover:bg-pink-600 border-0 p-4 h-auto flex justify-between items-center">
          <span className="font-medium">Discover your K-pop style!</span>
          <ArrowRightIcon color="white" />
        </Button>

        {/* Choose Your Concept Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Choose Your Concept</h2>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-200 rounded-lg flex items-center justify-center mx-auto mb-2 overflow-hidden">
                <Image
                  src={girlcrush}
                  alt="Girl Crush"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <span className="text-xs">Girl Crush</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-200 rounded-lg flex items-center justify-center mx-auto mb-2 overflow-hidden">
                <Image
                  src={lovely}
                  alt="Lovely & Fresh"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <span className="text-xs">Lovely & Fresh</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-200 rounded-lg flex items-center justify-center mx-auto mb-2 overflow-hidden">
                <Image
                  src={glow}
                  alt="Elegant & Glam"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <span className="text-xs">Elegant & Glam</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-200 rounded-lg flex items-center justify-center mx-auto mb-2 overflow-hidden">
                <Image
                  src={dreamy}
                  alt="Dreamy"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <span className="text-xs">Dreamy</span>
            </div>
          </div>
        </div>

        {/* Latest Trends Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Latest Trends in Korea</h2>
            <Link href="#" className="text-pink-500 text-sm">
              more &gt;
            </Link>
          </div>

          <div className="space-y-4">
            {/* Romantic School Idol Debut */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <Image
                      src={lovely}
                      alt="Romantic School Idol"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">
                      Romantic School Idol Debut
                    </h3>
                    <p className="text-xs text-gray-400">
                      ♫ Black Pink · Yongin
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      Step into soft pink lights. Romantic idol debut come true.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Y2K & Highteen Idol Debut */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <Image
                      src={highteen}
                      alt="Y2K & Highteen Idol"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">
                      Y2K & Highteen Idol Debut
                    </h3>
                    <p className="text-xs text-gray-400">
                      ♫ NewJeans · Gwangju
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      Be a teen heartthrob with kitsh, retro, glittery looks.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* K-traditional Idol Debut */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-200 to-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">👘</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">
                      K-traditional Idol Debut
                    </h3>
                    <p className="text-xs text-gray-400">
                      ♫ SUGA of BTS · Yongin
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      Flowing silk, soft colors, capture your own timeless
                      beauty in Hanok.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
