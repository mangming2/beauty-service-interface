"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCreateCommunityPost } from "@/queries/useCommunityQueries";
import { useTranslation } from "@/hooks/useTranslation";
import { gtag } from "@/lib/gtag";
import { Loading } from "@/components/common/Loading";
import { XIcon } from "@/components/common/Icons";

const PRESET_TAGS = ["Recruiting", "K-pop News", "K-Beauty"];

function ImageIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="6" fill="#3A3A3A" />
      <path d="M6 20l5-6 4 5 3-3.5L22 20H6z" fill="#bcbcbc" />
      <circle cx="10" cy="11" r="2" fill="#bcbcbc" />
    </svg>
  );
}

export default function CommunityWritePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const createPost = useCreateCommunityPost();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState("");

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setImages(prev => [...prev, ...files].slice(0, 5));
    e.target.value = "";
  }

  function removeImage(index: number) {
    setImages(prev => prev.filter((_, i) => i !== index));
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
        images: images.length ? images : undefined,
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

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <button onClick={() => router.back()} className="text-white">
          <XIcon width={18} height={18} color="white" />
        </button>
        <button
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim() || createPost.isPending}
          className="text-white text-md font-medium disabled:opacity-40"
        >
          Complete
        </button>
      </div>

      {/* Category */}
      <div className="px-5 pt-2 pb-4">
        <p className="text-lg font-bold text-white mb-3">
          카테고리를 선택해주세요
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                selectedTags.includes(tag)
                  ? "bg-pink-font border-pink-font text-white"
                  : "bg-transparent border-gray-outline text-gray_1"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-5 border-t border-gray-outline" />

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="제목을 입력하세요."
        className="w-full bg-transparent px-5 pt-5 pb-2 text-white text-xl font-bold placeholder:text-gray_1 outline-none"
      />

      {/* Content */}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="내용을 입력하세요."
        className="flex-1 w-full bg-transparent px-5 py-2 text-white text-md placeholder:text-gray_1 outline-none resize-none"
      />

      {error && <p className="px-5 pb-2 caption-md text-red-400">{error}</p>}

      {/* Image previews */}
      {images.length > 0 && (
        <div className="flex gap-2 px-5 pb-3 overflow-x-auto">
          {images.map((file, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-container"
            >
              <Image
                src={URL.createObjectURL(file)}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center text-white text-xs leading-none"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Bottom toolbar */}
      <div className="border-t border-gray-outline px-5 py-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageSelect}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 text-gray_1"
        >
          <ImageIcon />
          <span className="text-sm">image</span>
        </button>
      </div>
    </div>
  );
}
