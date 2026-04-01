"use client";

import type { CreateOptionRequest } from "@/api/option";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

/** 백엔드: 슬롯 시각은 09~16시만 허용 */
export const OPTION_SLOT_HOUR_MIN = 9;
export const OPTION_SLOT_HOUR_MAX = 16;

function clampSlotHour(h: number): number {
  return Math.min(OPTION_SLOT_HOUR_MAX, Math.max(OPTION_SLOT_HOUR_MIN, h));
}

export interface OptionFormFieldsProps {
  optionReq: CreateOptionRequest;
  setOptionReq: React.Dispatch<React.SetStateAction<CreateOptionRequest>>;
  optionTagsStr: string;
  setOptionTagsStr: (v: string) => void;
  optionImages: File[];
  setOptionImages: (files: File[]) => void;
}

export function OptionFormFields({
  optionReq,
  setOptionReq,
  optionTagsStr,
  setOptionTagsStr,
  setOptionImages,
}: OptionFormFieldsProps) {
  return (
    <>
      <div>
        <label className="block text-sm text-gray-400 mb-1">이름 *</label>
        <input
          required
          value={optionReq.name}
          onChange={e =>
            setOptionReq(prev => ({ ...prev, name: e.target.value }))
          }
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 outline-none focus:ring-1 focus:ring-pink-500"
          placeholder="뷰티 스파 이용권"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">설명 *</label>
        <textarea
          required
          value={optionReq.description}
          onChange={e =>
            setOptionReq(prev => ({
              ...prev,
              description: e.target.value,
            }))
          }
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 outline-none focus:ring-1 focus:ring-pink-500"
          placeholder="프라이빗 뷰티 스파 2시간 이용"
          rows={2}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          카테고리 태그명 *{" "}
          <span className="text-gray-500 font-normal">(백엔드 필수)</span>
        </label>
        <input
          required
          value={optionReq.categoryTagName}
          onChange={e =>
            setOptionReq(prev => ({
              ...prev,
              categoryTagName: e.target.value.trim(),
            }))
          }
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 outline-none focus:ring-1 focus:ring-pink-500"
          placeholder="hair"
        />
        <p className="text-gray-500 text-xs mt-1">
          옵션 대표 카테고리 1개 (API 필드{" "}
          <code className="text-gray-400">categoryTagName</code>)
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">가격 *</label>
          <input
            type="number"
            required
            value={optionReq.price}
            onChange={e =>
              setOptionReq(prev => ({
                ...prev,
                price: Number(e.target.value),
              }))
            }
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">할인율 (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={optionReq.discountRate ?? 0}
            onChange={e =>
              setOptionReq(prev => ({
                ...prev,
                discountRate: Number(e.target.value),
              }))
            }
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">주소 *</label>
        <input
          required
          value={optionReq.address}
          onChange={e =>
            setOptionReq(prev => ({ ...prev, address: e.target.value }))
          }
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          placeholder="Olympic-ro 300, Songpa-gu, Seoul"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            슬롯 시작일 *
          </label>
          <input
            type="date"
            required
            value={optionReq.slotStartDate}
            onChange={e =>
              setOptionReq(prev => ({
                ...prev,
                slotStartDate: e.target.value,
              }))
            }
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            슬롯 종료일 *
          </label>
          <input
            type="date"
            required
            value={optionReq.slotEndDate}
            onChange={e =>
              setOptionReq(prev => ({
                ...prev,
                slotEndDate: e.target.value,
              }))
            }
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            슬롯 시작 시 (시) *{" "}
            <span className="text-gray-500 font-normal">
              {OPTION_SLOT_HOUR_MIN}–{OPTION_SLOT_HOUR_MAX}
            </span>
          </label>
          <input
            type="number"
            required
            min={OPTION_SLOT_HOUR_MIN}
            max={OPTION_SLOT_HOUR_MAX}
            value={optionReq.slotStartHour}
            onChange={e =>
              setOptionReq(prev => ({
                ...prev,
                slotStartHour: Number(e.target.value),
              }))
            }
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            슬롯 종료 시 (시) *{" "}
            <span className="text-gray-500 font-normal">
              {OPTION_SLOT_HOUR_MIN}–{OPTION_SLOT_HOUR_MAX}
            </span>
          </label>
          <input
            type="number"
            required
            min={OPTION_SLOT_HOUR_MIN}
            max={OPTION_SLOT_HOUR_MAX}
            value={optionReq.slotEndHour}
            onChange={e =>
              setOptionReq(prev => ({
                ...prev,
                slotEndHour: Number(e.target.value),
              }))
            }
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">정기 휴무일</label>
        <select
          value={optionReq.regularClosingDay ?? ""}
          onChange={e =>
            setOptionReq(prev => ({
              ...prev,
              regularClosingDay: e.target.value || null,
            }))
          }
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
        >
          <option value="">없음</option>
          {DAYS.map(d => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            할인 시작일시
          </label>
          <input
            type="datetime-local"
            value={
              optionReq.discountStartAt
                ? optionReq.discountStartAt.slice(0, 16)
                : ""
            }
            onChange={e =>
              setOptionReq(prev => ({
                ...prev,
                discountStartAt: e.target.value
                  ? `${e.target.value}:00`
                  : undefined,
              }))
            }
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            할인 종료일시
          </label>
          <input
            type="datetime-local"
            value={
              optionReq.discountEndAt
                ? optionReq.discountEndAt.slice(0, 16)
                : ""
            }
            onChange={e =>
              setOptionReq(prev => ({
                ...prev,
                discountEndAt: e.target.value
                  ? `${e.target.value}:00`
                  : undefined,
              }))
            }
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">예약 안내</label>
        <input
          value={optionReq.bookingGuide ?? ""}
          onChange={e =>
            setOptionReq(prev => ({
              ...prev,
              bookingGuide: e.target.value,
            }))
          }
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          placeholder="네이버 예약"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          태그 (쉼표 구분)
        </label>
        <input
          value={optionTagsStr}
          onChange={e => setOptionTagsStr(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          placeholder="hair,makeup"
        />
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
            setOptionImages(e.target.files ? [...e.target.files] : [])
          }
          className="w-full text-sm text-gray-400 file:mr-2 file:py-2 file:px-3 file:rounded file:border-0 file:bg-gray-700 file:text-white"
        />
      </div>
    </>
  );
}

export function optionToCreateRequest(
  o: import("@/api/option").Option
): CreateOptionRequest {
  const parseHour = (t: string | undefined, fallback: number) => {
    if (!t) return fallback;
    const h = Number.parseInt(t.slice(0, 2), 10);
    return Number.isFinite(h) ? h : fallback;
  };
  const dateOnly = (d: string | undefined) => {
    if (!d) return undefined;
    return d.length >= 10 ? d.slice(0, 10) : d;
  };

  const today = new Date().toISOString().slice(0, 10);
  const nextYear = new Date(Date.now() + 365 * 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 10);

  const rawStart = dateOnly(o.slotStartDate);
  const rawEnd = dateOnly(o.slotEndDate);

  // 과거 날짜면 오늘/1년 후로 대체 (백엔드가 과거 슬롯 생성 거부)
  const slotStartDate = rawStart && rawStart >= today ? rawStart : today;
  const slotEndDate = rawEnd && rawEnd > slotStartDate ? rawEnd : nextYear;

  return {
    name: o.name,
    description: o.description,
    categoryTagName: o.categoryTagName?.trim() || "hair",
    price: o.price,
    address: o.address,
    slotStartDate,
    slotEndDate,
    slotStartHour: clampSlotHour(
      parseHour(o.slotStartTime, OPTION_SLOT_HOUR_MIN)
    ),
    slotEndHour: clampSlotHour(parseHour(o.slotEndTime, OPTION_SLOT_HOUR_MAX)),
    discountRate: o.discountRate,
    bookingGuide: o.bookingGuide ?? "",
    regularClosingDay: o.regularClosingDay,
    optionTagNames: [],
  };
}
