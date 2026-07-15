# Option Booking Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 옵션 예약 버튼이 옵션마다 고정된 더미 링크 대신 백엔드가 내려주는 실제 `bookingUrl`을 열도록 하고, 링크가 없는 옵션은 버튼을 비활성화 + 안내 툴팁을 노출한다.

**Architecture:** `Option` 타입에 옵셔널 `bookingUrl` 필드를 추가하고, 예약 상세 페이지(`package/[id]/[optionId]/page.tsx`)의 버튼 클릭 핸들러와 disabled 조건을 이 필드 기준으로 바꾼다. 툴팁은 새 의존성 없이 로컬 hover/focus state로 구현한다.

**Tech Stack:** Next.js (App Router), TypeScript, React, Tailwind CSS. 프로젝트에 컴포넌트 테스트 러너가 없으므로(`package.json`에 test 스크립트 없음) 각 태스크는 dev 서버를 띄워 브라우저에서 수동으로 검증한다.

## Global Constraints

- 새 npm 의존성 추가 금지 (radix tooltip 등 설치하지 않음)
- 백엔드 `bookingUrl` 필드는 아직 응답에 없을 수 있으므로 옵셔널로 다뤄 런타임 에러 없이 폴백(disabled)되어야 함
- 기존 disabled 조건(`!externalBookingAgreed || !selectedDate || !selectedTime`)은 그대로 유지하고 조건 추가만 함

---

### Task 1: `Option` 타입에 `bookingUrl` 추가

**Files:**
- Modify: `src/api/option.ts:41-62` (`Option` interface)

**Interfaces:**
- Produces: `Option.bookingUrl?: string | null` — Task 2에서 `currentOption.bookingUrl`로 참조

- [ ] **Step 1: 필드 추가**

`src/api/option.ts`의 `Option` interface에 다음 필드를 `representOption?: boolean;` 다음 줄에 추가:

```ts
  /** 실제 예약 URL (없으면 예약 버튼 비활성화) */
  bookingUrl?: string | null;
```

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 기존 에러 외 새 에러 없음 (필드가 optional이라 기존 코드에 영향 없음)

- [ ] **Step 3: Commit**

```bash
git add src/api/option.ts
git commit -m "feat: Option 타입에 bookingUrl 필드 추가"
```

---

### Task 2: 예약 버튼이 `bookingUrl` 사용하도록 변경 + 툴팁 추가

**Files:**
- Modify: `src/app/package/[id]/[optionId]/page.tsx:9` (import 제거)
- Modify: `src/app/package/[id]/[optionId]/page.tsx:127-138` (`handleBookLink`)
- Modify: `src/app/package/[id]/[optionId]/page.tsx:449-472` (버튼 JSX)
- Modify: `src/constants.ts` (더 이상 안 쓰는 `dummyLink` 제거)

**Interfaces:**
- Consumes: `Option.bookingUrl?: string | null` (Task 1)

- [ ] **Step 1: `dummyLink` import 제거**

`src/app/package/[id]/[optionId]/page.tsx:9` 삭제:

```ts
import { dummyLink } from "@/constants";
```

- [ ] **Step 2: `handleBookLink`가 `bookingUrl`을 열도록 변경**

`src/app/package/[id]/[optionId]/page.tsx:127-138`를 다음으로 교체:

```ts
  const handleBookLink = () => {
    if (!currentOption.bookingUrl) return;
    if (selectedDate) {
      sessionStorage.setItem("selectedBookingDate", selectedDate.toISOString());
    }
    if (selectedTime) {
      sessionStorage.setItem("selectedBookingTime", selectedTime);
    }
    if (selectedHour !== null) {
      sessionStorage.setItem("selectedStartHour", String(selectedHour));
    }
    window.open(currentOption.bookingUrl, "_blank");
  };
```

- [ ] **Step 3: 툴팁 상태 추가**

기존 state 선언부(`const [externalBookingAgreed, setExternalBookingAgreed] = useState(false);` 다음 줄, 함수 컴포넌트 최상단 근처)에 추가:

```ts
  const [showBookingUrlTooltip, setShowBookingUrlTooltip] = useState(false);
```

- [ ] **Step 4: 버튼 JSX를 disabled 조건 + 툴팁 wrapper로 교체**

`src/app/package/[id]/[optionId]/page.tsx:464-470`(예약 버튼 `<Button ... onClick={handleBookLink} ...>`)을 다음으로 교체:

```tsx
          <div className="relative flex-1">
            {showBookingUrlTooltip && !currentOption.bookingUrl && (
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white shadow">
                아직 예약링크가 없습니다
              </div>
            )}
            <span
              onMouseEnter={() => setShowBookingUrlTooltip(true)}
              onMouseLeave={() => setShowBookingUrlTooltip(false)}
              onFocus={() => setShowBookingUrlTooltip(true)}
              onBlur={() => setShowBookingUrlTooltip(false)}
              className="block"
            >
              <Button
                className="w-full h-[52px] text-lg"
                onClick={handleBookLink}
                disabled={
                  !externalBookingAgreed ||
                  !selectedDate ||
                  !selectedTime ||
                  !currentOption.bookingUrl
                }
              >
                {t("option.bookLink")}
              </Button>
            </span>
          </div>
```

이전 버튼은 `className="flex-1 h-[52px] text-lg"`를 직접 갖고 있었는데, `flex-1`이 새 wrapper `div`로 옮겨갔으므로 `Button`은 `w-full`로 바꿔 wrapper 안에서 꽉 채운다.

- [ ] **Step 5: 브라우저 수동 검증**

`npm run dev` 실행 후 `http://localhost:3000/package/1015/2107` 접속:
1. 약관 동의 + 날짜/시간 선택 후, 옵션에 `bookingUrl`이 없으면(현재 백엔드 미구현 상태) 예약 버튼이 비활성화되어 있고 hover 시 "아직 예약링크가 없습니다" 툴팁이 뜨는지 확인
2. 브라우저 개발자도구로 `useOptionDetail` 응답을 흉내내어(또는 백엔드 배포 후) `bookingUrl`이 있는 경우 버튼이 활성화되고 클릭 시 해당 URL이 새 탭으로 열리는지 확인
3. 기존 "완료" 버튼(`handleComplete`) 동작에는 변화가 없는지 확인

- [ ] **Step 6: 미사용 `dummyLink` 정리**

`grep -rn "dummyLink" src/` 실행해 참조가 `src/constants.ts` 자기 자신뿐이면 `src/constants.ts`에서 `dummyLink` export를 삭제.

- [ ] **Step 7: 타입 체크 + 커밋**

Run: `npx tsc --noEmit`
Expected: 에러 없음

```bash
git add src/app/package/\[id\]/\[optionId\]/page.tsx src/constants.ts
git commit -m "fix: 옵션 예약 버튼이 고정 더미 링크 대신 bookingUrl을 사용하도록 변경"
```
