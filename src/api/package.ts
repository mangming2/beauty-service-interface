import apiClient from "./index";
import type {
  GetPackagesRequest,
  GetPackagesResponse,
  PackageDetail,
} from "./package-controller.type";

/**
 * 패키지 목록 조회 API
 * GET /packages
 * no-offset 기반으로 패키지 목록을 조회합니다.
 * tag 미지정 시 태그가 없는 패키지만 조회합니다.
 */
export const getPackages = async (
  params?: GetPackagesRequest
): Promise<GetPackagesResponse> => {
  const response = await apiClient.get<GetPackagesResponse>("/packages", {
    params,
  });
  return response.data;
};

/**
 * 패키지 상세 조회 API
 * GET /packages/{packageId}
 * 특정 패키지의 상세 정보를 조회합니다.
 */
export const getPackageDetail = async (
  packageId: number
): Promise<PackageDetail> => {
  const response = await apiClient.get<PackageDetail>(`/packages/${packageId}`);
  return response.data;
};

// package-controller의 모든 API를 객체로 export
export const packageController = {
  getPackages,
  getPackageDetail,
};
