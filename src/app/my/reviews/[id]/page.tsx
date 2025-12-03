"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { usePackageDetail } from "@/queries/usePackageQueries";
import { useCreateReview } from "@/queries/useReviewQueries";
import { useUser } from "@/queries/useAuthQueries";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { format } from "date-fns";
import { GapY } from "@/components/ui/gap";
import { Divider } from "@/components/ui/divider";

export default function CreateReviewPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);

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

  if (packageLoading || userLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Spinner className="w-8 h-8 text-white" />
      </div>
    );
  }

  if (!packageDetail) {
    notFound();
  }

  return (
    <div className="text-white bg-transparent flex flex-col flex-1">
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        {/* Rating Section */}
        <div>
          <div className="flex flex-col p-5">
            <h2 className="title-lg">How did you like the package?</h2>
          </div>
          <GapY size={20} />
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size="lg"
            className="justify-center"
          />
        </div>

        <GapY size={20} />

        {/* Package Details */}
        <div className="px-5">
          <h3 className="title-sm">Your Package</h3>
          <GapY size={12} />
          <Card className="bg-transparent border-none px-0 pt-0 pb-3">
            <CardContent className="p-0">
              <div className="flex gap-2 pt-2 pb-3">
                <div className="relative w-20 h-20 overflow-hidden flex-shrink-0">
                  <Image
                    src={packageDetail.image_src[0] || "/dummy-profile.png"}
                    alt={packageDetail.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg text-white truncate">
                    {packageDetail.title}
                  </h4>
                  <p className="text-sm text-gray-font">
                    {packageDetail.location}
                  </p>
                  <GapY size={20} />
                  <p className="caption-md text-gray-400">
                    {format(new Date(), "yy.MM.dd")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Divider height={8} />

        {/* Review Input Section */}
        <div>
          <div className="flex py-3 px-5">
            <h3 className="title-sm">Your Review</h3>
          </div>

          {/* Comment Input */}
          <div className="flex flex-col px-5 gap-0">
            <textarea
              placeholder={isFocused ? "" : "Share your detailed review!"}
              value={comment}
              onChange={e => setComment(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="h-[128px] w-full px-4 py-3 rounded-[2px] bg-gray-outline border-none text-white placeholder:text-gray-font focus:outline-none focus:border-pink-500 resize-none"
              rows={6}
              maxLength={300}
            />
            <div className="text-right text-gray-font text-sm mt-1">
              {comment.length}/300
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div
          className="mt-auto py-4 px-5"
          style={{
            boxShadow: "inset 0 6px 6px -6px rgba(255, 255, 255, 0.12)",
          }}
        >
          <Button
            type="submit"
            className="w-full h-[52px] text-lg"
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
  );
}
