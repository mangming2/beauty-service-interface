import apiClient from "./index";
import type { GetUserRequest, User } from "./user-controller.type";

/**
 * 사용자 조회 API
 * GET /users
 */
export const getUser = async (params: GetUserRequest): Promise<User> => {
  const response = await apiClient.get<User>("/users", {
    params,
  });
  return response.data;
};

// user-controller의 모든 API를 객체로 export
export const userController = {
  getUser,
};
