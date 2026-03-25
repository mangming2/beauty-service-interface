"use client";

import { useRouter } from "next/navigation";
import { PageLoading } from "@/components/common";
import { GapY } from "../../components/ui/gap";
import { useWishes, useToggleWish } from "@/queries/useWishQueries";
import { useMyPageUser } from "@/queries/useMyPageQueries";
import { useEffect } from "react";
import { HeartIcon } from "@/components/common/Icons";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";
import Link from "next/link";

export default function Wish() {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: myPageUser, isLoading: userLoading } = useMyPageUser();
  const { data: wishes = [], isLoading: wishesLoading } = useWishes();
  const toggleWishMutation = useToggleWish();

  useEffect(() => {
    if (!userLoading && !myPageUser) {
      router.push("/login");
    }
  }, [myPageUser, userLoading, router]);

  if (userLoading || wishesLoading) {
    return <PageLoading />;
  }

  return (
    <div className="flex flex-col flex-1 text-white px-5 pt-6">
      <h1 className="title-lg text-white">{t("wish.myWishlist")}</h1>
      <GapY size={20} />

      {wishes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 pb-20">
          <Image src="/empty.png" alt="empty" width={180} height={120} />
          <p className="title-md text-white">{t("wish.emptyWishlist")}</p>
          <p className="text-md text-gray-font text-center">
            {t("wish.emptyWishlistSub")}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {wishes.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-[12px] bg-gray-container border border-[#2E3033] px-4 py-3"
            >
              <Link
                href={`/package/${item.id}`}
                className="flex-1 min-w-0 mr-3"
              >
                <p className="text-white font-semibold text-lg truncate">
                  {item.name}
                </p>
                {item.minPrice != null && (
                  <p className="text-gray-font text-md mt-0.5">
                    {t("wish.from")} ₩{item.minPrice.toLocaleString()}
                  </p>
                )}
              </Link>
              <button
                type="button"
                onClick={() => toggleWishMutation.mutate(item.id)}
                disabled={toggleWishMutation.isPending}
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center"
              >
                <HeartIcon color="#F92595" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
