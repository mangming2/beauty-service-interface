"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { usePackageDetail } from "@/hooks/usePackageQueries";
import { useCreateReview } from "@/hooks/useReviewQueries";
import { useUser } from "@/hooks/useAuthQueries";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { format } from "date-fns";

export default function CreateReviewPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: packageDetail, isLoading: packageLoading } =
    usePackageDetail(packageId);
  const { data: user, isLoading: userLoading } = useUser();
  const createReviewMutation = useCreateReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating || !comment.trim()) {
      alert("별점과 리뷰를 입력해주세요.");
      return;
    }

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 사용자 이름 자동 생성
    const username =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Anonymous";

    try {
      await createReviewMutation.mutateAsync({
        package_id: packageId,
        user_id: user.id,
        username,
        rating,
        comment: comment.trim(),
      });

      // 성공 후 패키지 페이지로 이동
      router.push(`/package/${packageId}`);
    } catch (error) {
      console.error("리뷰 작성 실패:", error);
      alert("리뷰 작성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (packageLoading || userLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Spinner className="w-8 h-8 text-white" />
      </div>
    );
  }

  if (!packageDetail) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-lg">패키지를 찾을 수 없습니다.</p>
          <Button onClick={handleBack} className="mt-4">
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
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
        <h1 className="text-lg font-semibold">리뷰 작성</h1>
        <div className="w-6"></div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Section */}
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">
              How did you like the package?
            </h2>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size="lg"
              className="justify-center"
            />
          </div>

          {/* Package Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Your Package</h3>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={packageDetail.image_src[0] || "/dummy-profile.png"}
                      alt={packageDetail.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-1">
                      {packageDetail.title}
                    </h4>
                    <p className="text-gray-400 text-sm mb-1">
                      {packageDetail.location}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {format(new Date(), "yy.MM.dd")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Review Input Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Your Review</h3>

            {/* Comment Input */}
            <div>
              <textarea
                placeholder="Share your detailed review!"
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 resize-none"
                rows={6}
                maxLength={300}
              />
              <div className="text-right text-gray-400 text-sm mt-2">
                {comment.length}/300
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 h-[52px] text-white font-medium"
              disabled={createReviewMutation.isPending}
            >
              {createReviewMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <Spinner className="w-4 h-4" />
                  저장 중...
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
