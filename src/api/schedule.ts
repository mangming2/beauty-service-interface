import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient";

// ========== 타입 정의 ==========

/** 일정 */
export interface Schedule {
  scheduleId: number;
  packageId: number;
  title: string;
  startAt: string;
  endAt: string;
}

/** 일정 목록 응답 (무한 스크롤) */
export interface ScheduleListResponse {
  schedules: Schedule[];
  hasNext: boolean;
  nextCursorId: number | null;
}

/** 일정 목록 조회 파라미터 */
export interface GetSchedulesParams {
  cursorId?: number;
  size?: number;
}

/** 일정 생성 요청 */
export interface CreateScheduleRequest {
  packageId: number;
  title: string;
  startAt: string;
  endAt: string;
}

/** 일정 수정 요청 */
export interface UpdateScheduleRequest {
  title: string;
  startAt: string;
  endAt: string;
}

// ========== 스케줄 API ==========

/**
 * 일정 목록 조회 (무한 스크롤)
 * GET /schedules
 */
export async function getSchedules(
  params: GetSchedulesParams = {}
): Promise<ScheduleListResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (params.cursorId !== undefined) {
      queryParams.append("cursorId", String(params.cursorId));
    }
    if (params.size !== undefined) {
      queryParams.append("size", String(params.size));
    }

    const queryString = queryParams.toString();
    const url = `/schedules${queryString ? `?${queryString}` : ""}`;

    const data = await apiGet<ScheduleListResponse>(url);
    return data;
  } catch (error) {
    console.error("Get schedules error:", error);
    throw error;
  }
}

/**
 * 일정 상세 조회
 * GET /schedules/:scheduleId
 */
export async function getScheduleDetail(
  scheduleId: number
): Promise<Schedule | null> {
  try {
    const data = await apiGet<Schedule>(`/schedules/${scheduleId}`);
    return data;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      (error as { status: number }).status === 404
    ) {
      return null;
    }
    console.error("Get schedule detail error:", error);
    throw error;
  }
}

/**
 * 일정 생성
 * POST /schedules
 */
export async function createSchedule(
  request: CreateScheduleRequest
): Promise<Schedule> {
  try {
    const data = await apiPost<Schedule>("/schedules", request);
    return data;
  } catch (error) {
    console.error("Create schedule error:", error);
    throw error;
  }
}

/**
 * 일정 수정
 * PUT /schedules/:scheduleId
 */
export async function updateSchedule(
  scheduleId: number,
  request: UpdateScheduleRequest
): Promise<Schedule> {
  try {
    const data = await apiPut<Schedule>(`/schedules/${scheduleId}`, request);
    return data;
  } catch (error) {
    console.error("Update schedule error:", error);
    throw error;
  }
}

/**
 * 일정 삭제
 * DELETE /schedules/:scheduleId
 */
export async function deleteSchedule(scheduleId: number): Promise<void> {
  try {
    await apiDelete(`/schedules/${scheduleId}`);
  } catch (error) {
    console.error("Delete schedule error:", error);
    throw error;
  }
}
