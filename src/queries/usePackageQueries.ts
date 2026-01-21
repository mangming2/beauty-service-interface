import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  getPackages,
  getPackageDetail,
  getPackagesByTag,
  type Package,
  type PackageDetail,
  type GetPackagesParams,
} from "@/api/package";

// ========== Query Keys ==========

export const packageKeys = {
  all: ["packages"] as const,
  lists: () => [...packageKeys.all, "list"] as const,
  list: (filters: GetPackagesParams) =>
    [...packageKeys.lists(), filters] as const,
  details: () => [...packageKeys.all, "detail"] as const,
  detail: (id: number) => [...packageKeys.details(), id] as const,
  byTag: (tag: string) => [...packageKeys.all, "tag", tag] as const,
} as const;

// ========== 패키지 목록 조회 ==========

/**
 * 패키지 목록 조회 (단일 페이지)
 */
export function usePackages(params: GetPackagesParams = {}) {
  return useQuery<Package[]>({
    queryKey: packageKeys.list(params),
    queryFn: () => getPackages(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * 패키지 목록 무한 스크롤 (커서 기반)
 */
export function useInfinitePackages(
  params: Omit<GetPackagesParams, "lastId"> = {}
) {
  return useInfiniteQuery<Package[]>({
    queryKey: [...packageKeys.lists(), "infinite", params],
    queryFn: ({ pageParam }) =>
      getPackages({
        ...params,
        lastId: pageParam as number | undefined,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: lastPage => {
      if (!lastPage || lastPage.length === 0) return undefined;
      // 기본 size(20)보다 적으면 마지막 페이지
      const size = params.size ?? 20;
      if (lastPage.length < size) return undefined;
      return lastPage[lastPage.length - 1].id;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// ========== 패키지 상세 조회 ==========

/**
 * 특정 패키지 상세 정보 조회
 */
export function usePackageDetail(packageId: number | undefined) {
  return useQuery<PackageDetail | null>({
    queryKey: packageKeys.detail(packageId!),
    queryFn: () => getPackageDetail(packageId!),
    enabled: packageId !== undefined,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// ========== 태그별 패키지 조회 ==========

/**
 * 태그별 패키지 목록 조회 (단일 페이지)
 */
export function usePackagesByTag(
  tag: string,
  params: Omit<GetPackagesParams, "tag"> = {}
) {
  return useQuery<Package[]>({
    queryKey: packageKeys.byTag(tag),
    queryFn: () => getPackagesByTag(tag, params),
    enabled: !!tag,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * 태그별 패키지 무한 스크롤
 */
export function useInfinitePackagesByTag(
  tag: string,
  params: Omit<GetPackagesParams, "tag" | "lastId"> = {}
) {
  return useInfiniteQuery<Package[]>({
    queryKey: [...packageKeys.byTag(tag), "infinite", params],
    queryFn: ({ pageParam }) =>
      getPackagesByTag(tag, {
        ...params,
        lastId: pageParam as number | undefined,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: lastPage => {
      if (!lastPage || lastPage.length === 0) return undefined;
      const size = params.size ?? 20;
      if (lastPage.length < size) return undefined;
      return lastPage[lastPage.length - 1].id;
    },
    enabled: !!tag,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// ========== 여러 패키지 조회 ==========

/**
 * 여러 패키지 ID로 패키지 정보를 가져오는 훅
 */
export function useMultiplePackageDetails(packageIds: number[]) {
  return useQuery<PackageDetail[]>({
    queryKey: [...packageKeys.all, "multiple", [...packageIds].sort()],
    queryFn: async () => {
      const promises = packageIds.map(async id => {
        try {
          return await getPackageDetail(id);
        } catch {
          return null;
        }
      });
      const results = await Promise.all(promises);
      return results.filter((pkg): pkg is PackageDetail => pkg !== null);
    },
    enabled: packageIds.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
