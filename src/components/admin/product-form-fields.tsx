"use client";

import type { Option } from "@/api/option";

export interface ProductFormFieldsProps {
  productName: string;
  setProductName: (v: string) => void;
  productDescription: string;
  setProductDescription: (v: string) => void;
  productOptionIds: number[];
  toggleProductOption: (id: number) => void;
  representOptionId: number | "";
  setRepresentOptionId: (v: number | "") => void;
  options: Option[];
  productImages: File[];
  setProductImages: (files: File[]) => void;
}

export function ProductFormFields({
  productName,
  setProductName,
  productDescription,
  setProductDescription,
  productOptionIds,
  toggleProductOption,
  representOptionId,
  setRepresentOptionId,
  options,
  setProductImages,
}: ProductFormFieldsProps) {
  return (
    <>
      <div>
        <label className="block text-sm text-gray-400 mb-1">상품명 *</label>
        <input
          required
          value={productName}
          onChange={e => setProductName(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          placeholder="뷰티 올인원 패키지"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">설명 *</label>
        <textarea
          required
          value={productDescription}
          onChange={e => setProductDescription(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          placeholder="머리와 피부 관리를 진행합니다"
          rows={2}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          포함 옵션 (복수 선택) *
        </label>
        <div className="flex flex-wrap gap-2">
          {options.map(opt => (
            <label
              key={opt.id}
              className="flex items-center gap-2 px-3 py-2 rounded bg-gray-800 border border-gray-600 cursor-pointer hover:border-pink-500"
            >
              <input
                type="checkbox"
                checked={productOptionIds.includes(opt.id)}
                onChange={() => toggleProductOption(opt.id)}
              />
              <span className="text-sm">
                {opt.name} (ID: {opt.id})
              </span>
            </label>
          ))}
        </div>
        {options.length === 0 && (
          <p className="text-gray-500 text-sm">
            먼저 옵션을 생성한 뒤 상품에 연결하세요.
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          대표 옵션 ID *
        </label>
        <select
          value={representOptionId}
          onChange={e =>
            setRepresentOptionId(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
        >
          <option value="">
            {productOptionIds.length
              ? "선택 (미선택 시 첫 옵션)"
              : "옵션을 먼저 선택하세요"}
          </option>
          {options
            .filter(o => productOptionIds.includes(o.id))
            .map(o => (
              <option key={o.id} value={o.id}>
                {o.name} (ID: {o.id})
              </option>
            ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          이미지 (선택)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={e =>
            setProductImages(e.target.files ? [...e.target.files] : [])
          }
          className="w-full text-sm text-gray-400 file:mr-2 file:py-2 file:px-3 file:rounded file:border-0 file:bg-gray-700 file:text-white"
        />
      </div>
    </>
  );
}
