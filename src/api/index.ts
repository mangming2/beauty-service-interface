import axios, {
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// 개발 환경에서 baseURL 로깅
if (process.env.NODE_ENV === "development") {
  console.log("API Base URL:", baseURL);
}

// axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 (토큰 추가 등)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 필요시 여기서 토큰 추가
    // const token = getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리 등)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // 공통 에러 처리
    if (error.response) {
      // 서버에서 응답이 왔지만 에러 상태 코드
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못함
      const errorMessage =
        error.code === "ERR_NETWORK"
          ? `네트워크 오류: API 서버(${baseURL})에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.`
          : "네트워크 오류가 발생했습니다.";
      console.error("Network Error:", errorMessage);
      // 에러 객체에 사용자 친화적인 메시지 추가
      (error as AxiosError & { userMessage?: string }).userMessage =
        errorMessage;
    } else {
      // 요청 설정 중 에러 발생
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
