"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateCommunityPost } from "@/queries/useCommunityQueries";
import { useTranslation } from "@/hooks/useTranslation";
import { gtag } from "@/lib/gtag";
import { Loading } from "@/components/common/Loading";

const PRESET_TAGS = ["Recruiting", "K-pop News", "K-Beauty"];

export default function CommunityWritePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const createPost = useCreateCommunityPost();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState("");

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) return;
    setError("");
    try {
      const result = await createPost.mutateAsync({
        request: {
          title: title.trim(),
          content: content.trim(),
          tags: selectedTags,
        },
      });
      gtag.postCreate(selectedTags);
      router.replace(`/board/community/${result.id}`);
    } catch {
      setError(t("communityPage.submitError"));
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-white">
      {createPost.isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
          <Loading size="md" />
        </div>
      )}
      {/* Inline header bar for write page */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-outline">
        <button
          onClick={() => router.back()}
          className="caption-md text-gray_1"
        >
          ✕
        </button>
        <span className="text-md font-semibold text-white">
          {t("communityPage.writePost")}
        </span>
        <button
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim() || createPost.isPending}
          className="caption-md text-pink-font font-semibold disabled:opacity-40"
        >
          {createPost.isPending ? "..." : t("communityPage.submitPost")}
        </button>
      </div>

      {/* Title input */}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder={t("communityPage.titlePlaceholder")}
        className="w-full bg-transparent px-5 py-4 text-white text-md font-semibold placeholder:text-gray_1 outline-none border-b border-gray-outline"
      />

      {/* Content textarea */}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={t("communityPage.contentPlaceholder")}
        className="flex-1 w-full bg-transparent px-5 py-4 text-white text-md placeholder:text-gray_1 outline-none resize-none"
        rows={12}
      />

      {/* Tag selection */}
      <div className="px-5 py-4 border-t border-gray-outline">
        <p className="caption-md text-gray_1 mb-3">
          {t("communityPage.selectTags")}
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full caption-md font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? "bg-pink-font text-white"
                  : "bg-gray-container text-gray_1"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="px-5 pb-4 caption-md text-red-400">{error}</p>}
    </div>
  );
}
