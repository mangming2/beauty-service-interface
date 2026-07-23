"use client";

import type { CreateOptionRequest, SeoulDistrict } from "@/api/option";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const SEOUL_DISTRICTS: Array<{ value: SeoulDistrict; label: string }> = [
  { value: "GANGNAM", label: "강남구" },
  { value: "GANGDONG", label: "강동구" },
  { value: "GANGBUK", label: "강북구" },
  { value: "GANGSEO", label: "강서구" },
  { value: "GWANAK", label: "관악구" },
  { value: "GWANGJIN", label: "광진구" },
  { value: "GURO", label: "구로구" },
  { value: "GEUMCHEON", label: "금천구" },
  { value: "NOWON", label: "노원구" },
  { value: "DOBONG", label: "도봉구" },
  { value: "DONGDAEMUN", label: "동대문구" },
  { value: "DONGJAK", label: "동작구" },
  { value: "MAPO", label: "마포구" },
  { value: "SEODAEMUN", label: "서대문구" },
  { value: "SEOCHO", label: "서초구" },
  { value: "SEONGDONG", label: "성동구" },
  { value: "SEONGBUK", label: "성북구" },
  { value: "SONGPA", label: "송파구" },
  { value: "YANGCHEON", label: "양천구" },
  { value: "YEONGDEUNGPO", label: "영등포구" },
  { value: "YONGSAN", label: "용산구" },
  { value: "EUNPYEONG", label: "은평구" },
  { value: "JONGNO", label: "종로구" },
  { value: "JUNG", label: "중구" },
  { value: "JUNGNANG", label: "중랑구" },
];

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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          {/* 참고: 기존에 구가 설정된 옵션은 "없음"을 골라 저장해도 백엔드가
              null을 "필드 미전송"과 구분하지 못해(OptionCommandService.updateOption()의
              district = command.district ?: option.district) 기존 값이 유지될 수 있음.
              백엔드에서 명시적 삭제를 지원해야 수정 시에도 완전히 동작함. */}
          <label className="block text-sm text-gray-400 mb-1">서울 구</label>
          <select
            value={optionReq.district ?? ""}
            onChange={e =>
              setOptionReq(prev => ({
                ...prev,
                district: e.target.value
                  ? (e.target.value as SeoulDistrict)
                  : null,
              }))
            }
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          >
            <option value="">없음 (방문 장소 없는 온라인/원격 옵션)</option>
            {SEOUL_DISTRICTS.map(district => (
              <option key={district.value} value={district.value}>
                {district.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            상세 주소{" "}
            <span className="text-gray-500 font-normal">
              (비워두면 개별 협의로 노출)
            </span>
          </label>
          <input
            value={optionReq.detailAddress}
            onChange={e =>
              setOptionReq(prev => ({
                ...prev,
                detailAddress: e.target.value,
              }))
            }
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
            placeholder="테헤란로 427 3층"
          />
        </div>
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
          예약 링크{" "}
          <span className="text-gray-500 font-normal">
            (비어있으면 예약 버튼 비활성화)
          </span>
        </label>
        <input
          value={optionReq.reservationUrl ?? ""}
          onChange={e =>
            setOptionReq(prev => ({
              ...prev,
              reservationUrl: e.target.value || undefined,
            }))
          }
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          placeholder="https://booking.naver.com/..."
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
  const dateOnly = (d: string | null | undefined) => {
    if (!d) return undefined;
    return d.length >= 10 ? d.slice(0, 10) : d;
  };

  const today = new Date().toISOString().slice(0, 10);
  const nextYear = new Date(Date.now() + 365 * 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 10);

  const rawStart = dateOnly(o.slotAvailableFrom);
  const rawEnd = dateOnly(o.slotAvailableUntil);

  const slotStartDate = rawStart && rawStart >= today ? rawStart : today;
  const slotEndDate = rawEnd && rawEnd > slotStartDate ? rawEnd : nextYear;

  // 백엔드는 상세 조회 시 이미 할인 적용된 price를 내려줌 (b6c74eb 참고).
  // 원가 입력칸에 그대로 채우면 저장할 때마다 할인이 중첩 적용되므로 역산해서 복원한다.
  const originalPrice =
    o.discountRate > 0
      ? Math.round(o.price / (1 - o.discountRate / 100))
      : o.price;

  return {
    name: o.name,
    description: o.description,
    categoryTagName: o.categoryTagName?.trim() || "hair",
    price: originalPrice,
    // 온라인/원격 옵션처럼 방문 장소가 없으면 백엔드가 null을 내려줌.
    // 상세 주소는 아직 "장소 없음"을 표현하지 못하므로 편집 시 빈 문자열로 대체한다.
    detailAddress: o.detailAddress ?? "",
    district: o.district,
    slotStartDate,
    slotEndDate,
    slotStartHour: clampSlotHour(o.slotStartHour ?? OPTION_SLOT_HOUR_MIN),
    slotEndHour: clampSlotHour(o.slotEndHour ?? OPTION_SLOT_HOUR_MAX),
    discountRate: o.discountRate,
    bookingGuide: o.bookingGuide ?? "",
    regularClosingDay: o.regularClosingDay,
    optionTagNames: [],
    reservationUrl: o.reservationUrl,
  };
}
