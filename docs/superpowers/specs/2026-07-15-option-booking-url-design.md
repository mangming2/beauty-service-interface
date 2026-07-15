# Option Booking Link Design

**Date:** 2026-07-15

## Overview

옵션 예약 버튼(`/package/[id]/[optionId]`)이 현재 실제 옵션과 무관하게 항상 고정된 더미 URL(`dummyLink`, 네이버 검색 링크)을 새 탭으로 여는 버그가 있다. 백엔드가 옵션별 실제 예약 URL(`bookingUrl`)을 내려주도록 별도로 요청된 상태이므로, 프론트엔드는 이 필드를 사용하도록 변경한다. `bookingUrl`이 없는 옵션은 예약 버튼을 비활성화하고, 이유를 알리는 툴팁을 노출한다.

## Scope

- `Option` 타입에 `bookingUrl` 필드 추가 (API 레이어)
- 예약 버튼(`option.bookLink`) 클릭 시 `dummyLink` 대신 `currentOption.bookingUrl`을 오픈
- `bookingUrl`이 없으면 버튼 disabled + 커스텀 툴팁("아직 예약링크가 없습니다") 노출
- `dummyLink`/`constants.ts` 정리 (다른 곳에서 미사용 시 제거)

## Architecture

### 1. API Layer — `src/api/option.ts`

`Option` 인터페이스에 필드 추가:

```ts
export interface Option {
  ...
  bookingUrl?: string | null;
}
```

백엔드가 아직 필드를 내려주지 않아도 옵셔널이라 안전하게 동작한다 (없으면 버튼 비활성화로 폴백).

### 2. Booking Page — `src/app/package/[id]/[optionId]/page.tsx`

- `dummyLink` import 제거
- `handleBookLink`에서 `window.open(dummyLink, "_blank")` → `window.open(currentOption.bookingUrl!, "_blank")`로 변경 (호출 전 존재 확인은 버튼 disabled로 보장)
- 예약 버튼 `disabled` 조건에 `!currentOption.bookingUrl` 추가:
  ```ts
  disabled={
    !externalBookingAgreed ||
    !selectedDate ||
    !selectedTime ||
    !currentOption.bookingUrl
  }
  ```
- 버튼을 감싸는 wrapper(`span` 등)에 hover/focus 상태를 로컬 state로 관리하는 가벼운 커스텀 툴팁 추가. `!currentOption.bookingUrl`일 때만 "아직 예약링크가 없습니다" 텍스트를 노출한다. (프로젝트에 radix tooltip 미설치 — 새 의존성 추가하지 않음)

### 3. Constants — `src/constants.ts`

- `dummyLink`를 다른 곳에서 참조하지 않으면 제거. 참조하는 곳이 남아있다면 그대로 둔다.

## Data Flow

```
GET /options/:optionId → OptionSpecificResponse (bookingUrl 포함 예정)
  → currentOption.bookingUrl
  → 있음: 예약 버튼 활성화, 클릭 시 window.open(bookingUrl)
  → 없음: 예약 버튼 disabled, hover/focus 시 안내 툴팁
```

## Out of Scope

- 백엔드 `bookingUrl` 필드 구현 (별도로 요청 완료, 이 스펙은 프론트엔드 소비 측만 다룸)
- 옵션 목록 카드(`package/[id]/page.tsx`)는 예약 버튼이 없으므로 변경 없음
