// 패키지 목록 조회 요청 타입
export interface GetPackagesRequest {
  lastId?: number; // 이전 페이지 마지막 패키지 ID (커서)
  size?: number; // 조회 개수 (기본값: 20)
  tag?: string; // 태그(카테고리)명. 미지정 시 태그 없는 패키지
}

// 패키지 응답 타입
export interface Package {
  id: number;
  name: string;
  description: string;
  minPrice: number;
  totalPrice: number;
  tagNames: string[];
}

// 패키지 목록 조회 응답 타입
export type GetPackagesResponse = Package[];

// 패키지 상세 조회 요청 타입
export interface GetPackageDetailRequest {
  packageId: number; // 패키지 ID (path parameter)
}

// 패키지 상품 타입
export interface PackageProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  location: string;
}

// 패키지 상세 응답 타입
export interface PackageDetail {
  id: number;
  name: string;
  description: string;
  products: PackageProduct[];
  tagNames: string[];
  slotStartDate: string; // "2025-01-01"
  slotEndDate: string; // "2025-01-07"
  slotStartTime: string; // "09:00:00"
  slotEndTime: string; // "16:00:00"
  reservationSlotCount: number;
  minPrice: number;
  totalPrice: number;
}
