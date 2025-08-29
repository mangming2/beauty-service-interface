import { z } from "zod";

// 폼 데이터 스키마 정의
export const FormDataSchema = z.object({
  // Step 1: 컨셉 선택 (최대 3개)
  selectedConcepts: z
    .array(z.string())
    .min(1, "최소 1개의 컨셉을 선택해주세요")
    .max(3, "최대 3개까지 선택 가능합니다"),

  // Step 2: 좋아하는 아이돌
  favoriteIdol: z.string().min(1, "아이돌 이름을 입력해주세요"),

  // Step 3: 아이돌 옵션 선택
  idolOption: z.string().min(1, "옵션을 선택해주세요"),

  // Step 4: 날짜 범위 선택
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),

  // Step 5: 지역 선택
  selectedRegions: z.array(z.string()).min(1, "최소 1개의 지역을 선택해주세요"),
});

// 폼 데이터 타입
export type FormData = z.infer<typeof FormDataSchema>;

// 각 스텝별 스키마 - undefined 허용하도록 수정
export const Step1Schema = z.object({
  selectedConcepts: z
    .array(z.string())
    .min(1, "최소 1개의 컨셉을 선택해주세요")
    .max(3, "최대 3개까지 선택 가능합니다"),
});

export const Step2Schema = z.object({
  favoriteIdol: z.string().min(1, "아이돌 이름을 입력해주세요"),
});

export const Step3Schema = z.object({
  idolOption: z.string().min(1, "옵션을 선택해주세요"),
});

export const Step4Schema = z.object({
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .refine(data => data.from && data.to, {
      message: "시작 날짜와 종료 날짜를 모두 선택해주세요",
    }),
});

export const Step5Schema = z.object({
  selectedRegions: z.array(z.string()).min(1, "최소 1개의 지역을 선택해주세요"),
});

// 각 스텝별 타입
export type Step1Data = z.infer<typeof Step1Schema>;
export type Step2Data = z.infer<typeof Step2Schema>;
export type Step3Data = z.infer<typeof Step3Schema>;
export type Step4Data = z.infer<typeof Step4Schema>;
export type Step5Data = z.infer<typeof Step5Schema>;

// 컨셉 옵션들
export const concepts = [
  {
    id: "girlcrush",
    name: "Girl Crush",
  },
  {
    id: "lovely",
    name: "Lovely & Fresh",
  },
  {
    id: "elegant",
    name: "Elegant & Glam",
  },
  {
    id: "dreamy",
    name: "Dreamy",
  },
  {
    id: "highteen",
    name: "Highteen",
  },
  {
    id: "etc",
    name: "Etc",
  },
] as const;

// 아이돌 옵션들
export const idolOptions = [
  "K-pop stage outfit & concept shoot",
  "Casual daily look snapshot",
  "Hair & makeup only",
  "Themed shoot with friends or family",
  "Profile portrait shoot",
] as const;
