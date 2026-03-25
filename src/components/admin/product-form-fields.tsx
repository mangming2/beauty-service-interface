"use client";

export type ProductFormPickerOption = { id: number; name: string };

export interface ProductFormFieldsProps {
  productName: string;
  setProductName: (v: string) => void;
  productDescription: string;
  setProductDescription: (v: string) => void;
  productOptionIds: number[];
  representOptionId: number | "";
  setRepresentOptionId: (v: number | "") => void;
  productImages: File[];
  setProductImages: (files: File[]) => void;

  /** 체크박스로 옵션 고르기 (상품 수정 등, GET /products/:id/options 로 채움) */
  pickerOptions?: ProductFormPickerOption[];
  toggleProductOption?: (id: number) => void;

  /** 옵션 ID 직접 입력 (상품 생성 등 — 전체 옵션 목록 API 없음) */
  optionIdsText?: string;
  onOptionIdsTextChange?: (text: string) => void;
  /** ID 입력 모드에서 대표 옵션 셀렉트 라벨 (참고 상품 옵션 등) */
  optionIdModeLabels?: ProductFormPickerOption[];
}

export function ProductFormFields({
  productName,
  setProductName,
  productDescription,
  setProductDescription,
  productOptionIds,
  representOptionId,
  setRepresentOptionId,
  pickerOptions = [],
  toggleProductOption,
  optionIdsText,
  onOptionIdsTextChange,
  optionIdModeLabels,
  setProductImages,
}: ProductFormFieldsProps) {
  const isOptionIdMode =
    optionIdsText !== undefined && onOptionIdsTextChange !== undefined;

  const rowsForRepresent: ProductFormPickerOption[] = isOptionIdMode
    ? productOptionIds.map(id => {
        const labeled = optionIdModeLabels?.find(o => o.id === id);
        return labeled ?? { id, name: `옵션 #${id}` };
      })
    : pickerOptions.filter(o => productOptionIds.includes(o.id));

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
      {isOptionIdMode ? (
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            포함 옵션 ID * (쉼표·공백으로 구분)
          </label>
          <input
            required
            value={optionIdsText}
            onChange={e => onOptionIdsTextChange(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 font-mono text-sm"
            placeholder="예: 1, 2, 5"
          />
          <p className="text-gray-500 text-xs mt-1 leading-relaxed">
            쉼표·공백으로 구분합니다. 생성 시에는 옵션 ID를 직접 입력하고, 수정
            시에는 현재 연결된 ID가 채워지며 여기서 추가·삭제할 수 있습니다.
          </p>
        </div>
      ) : (
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            포함 옵션 (복수 선택) *
          </label>
          <div className="flex flex-wrap gap-2">
            {pickerOptions.map(opt => (
              <label
                key={opt.id}
                className="flex items-center gap-2 px-3 py-2 rounded bg-gray-800 border border-gray-600 cursor-pointer hover:border-pink-500"
              >
                <input
                  type="checkbox"
                  checked={productOptionIds.includes(opt.id)}
                  onChange={() => toggleProductOption?.(opt.id)}
                />
                <span className="text-sm">
                  {opt.name} (ID: {opt.id})
                </span>
              </label>
            ))}
          </div>
          {pickerOptions.length === 0 && (
            <p className="text-gray-500 text-sm">
              이 상품에 연결된 옵션이 없습니다.
            </p>
          )}
        </div>
      )}
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
              : "옵션 ID를 먼저 지정하세요"}
          </option>
          {rowsForRepresent.map(o => (
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
