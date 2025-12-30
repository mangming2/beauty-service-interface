/**
 * 쿼리 키를 중앙에서 관리하는 파일
 */

// Auth Controller Keys (auth-controller API)
export const authControllerKeys = {
  all: ["auth-controller"] as const,
  login: () => [...authControllerKeys.all, "login"] as const,
  reissue: () => [...authControllerKeys.all, "reissue"] as const,
  logout: () => [...authControllerKeys.all, "logout"] as const,
} as const;

// User Controller Keys (user-controller API)
export const userKeys = {
  all: ["users"] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (userId: number) => [...userKeys.details(), userId] as const,
} as const;
