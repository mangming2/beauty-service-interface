import { useQuery } from "@tanstack/react-query";
import {
  getAllPackages,
  getPackageDetail,
  getPackagesByArtist,
  getPackagesByTag,
  searchPackages,
} from "@/api/package";
import type { Package, PackageDetail } from "@/types/api";

// Query Keys
export const packageKeys = {
  all: ["packages"] as const,
  lists: () => [...packageKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...packageKeys.lists(), filters] as const,
  details: () => [...packageKeys.all, "detail"] as const,
  detail: (id: string) => [...packageKeys.details(), id] as const,
  byArtist: (artist: string) => [...packageKeys.all, "artist", artist] as const,
  byTag: (tag: string) => [...packageKeys.all, "tag", tag] as const,
  search: (query: string) => [...packageKeys.all, "search", query] as const,
} as const;

// 모든 패키지 목록 조회
export function useAllPackages() {
  return useQuery<Package[]>({
    queryKey: packageKeys.lists(),
    queryFn: async () => {
      return await getAllPackages();
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 2,
  });
}

// 특정 패키지 상세 정보 조회
export function usePackageDetail(packageId: string) {
  return useQuery<PackageDetail | null>({
    queryKey: packageKeys.detail(packageId),
    queryFn: async () => {
      return await getPackageDetail(packageId);
    },
    enabled: !!packageId,
    staleTime: 5 * 60 * 1000, // 5분
    retry: 2,
  });
}

// 아티스트별 패키지 목록 조회
export function usePackagesByArtist(artist: string) {
  return useQuery<Package[]>({
    queryKey: packageKeys.byArtist(artist),
    queryFn: async () => {
      return await getPackagesByArtist(artist);
    },
    enabled: !!artist,
    staleTime: 5 * 60 * 1000, // 5분
    retry: 2,
  });
}

// 태그별 패키지 목록 조회
export function usePackagesByTag(tag: string) {
  return useQuery<Package[]>({
    queryKey: packageKeys.byTag(tag),
    queryFn: async () => {
      return await getPackagesByTag(tag);
    },
    enabled: !!tag,
    staleTime: 5 * 60 * 1000, // 5분
    retry: 2,
  });
}

// 패키지 검색
export function useSearchPackages(query: string) {
  return useQuery<Package[]>({
    queryKey: packageKeys.search(query),
    queryFn: async () => {
      return await searchPackages(query);
    },
    enabled: !!query && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2분 (검색 결과는 더 자주 업데이트)
    retry: 1,
  });
}

// 여러 패키지 ID로 패키지 정보를 가져오는 훅
export function useMultiplePackageDetails(packageIds: string[]) {
  return useQuery<PackageDetail[]>({
    queryKey: [...packageKeys.all, "multiple", packageIds.sort()],
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
    staleTime: 5 * 60 * 1000, // 5분
    retry: 2,
  });
}
