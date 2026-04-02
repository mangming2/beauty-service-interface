# 상품 생성 옵션 선택 UI 개선 — 설계 문서

**날짜:** 2026-04-02  
**범위:** 관리자 페이지 > 상품 생성 탭  
**관련 파일:** `src/app/admin/page.tsx`, `src/components/admin/product-form-fields.tsx`

---

## 배경

현재 상품 생성 시 포함 옵션을 `"1, 2, 5"` 형태의 ID 직접 입력으로 받고 있어 사용성이 떨어진다. `GET /options` API가 이미 존재하고 `useOptions()` 훅도 구현되어 있으므로, 전체 옵션 목록을 체크박스로 보여주는 방식으로 전환한다.

---

## 목표

- 관리자가 옵션 ID를 외우거나 따로 조회하지 않고, 목록에서 바로 체크해 선택할 수 있게 한다.
- 태그 필터 + 검색으로 옵션이 많아져도 원하는 항목을 빠르게 찾을 수 있게 한다.

---

## 변경 사항

### 1. `product-form-fields.tsx`

#### `ProductFormPickerOption` 타입 확장
```ts
// 기존
export type ProductFormPickerOption = { id: number; name: string };

// 변경
export type ProductFormPickerOption = { id: number; name: string; price?: number };
```

#### 체크박스 라벨 변경
- 기존: `{opt.name} (ID: {opt.id})`
- 변경: `{opt.name} (ID: {opt.id} · {price}원)` — price가 있을 때만 표시

---

### 2. `admin/page.tsx`

#### 제거
- 상태: `optionIdsText`, `refProductIdStr`
- 훅: `useProductOptions` (import 포함)
- 계산: `refProductIdParsed`, `refProductOptions`, `optionIdModeLabels`
- 핸들러: `handleOptionIdsTextChange`
- UI: "이름 참고용 상품 ID" 입력 필드

#### 추가
- 훅: `useOptions()` — `GET /options` 전체 옵션 로드
- 상태: `tagFilter: string` (기본값 `"전체"`)
- 상태: `optionSearch: string` (기본값 `""`)
- 핸들러: `toggleProductOption(id: number)` — 선택/해제 토글, 대표 옵션 초기화 포함
- 계산: `allTags` — `OptionCatalogItem.categoryTagName`에서 중복 제거 후 추출
- 계산: `filteredOptions` — `allOptions`에서 태그 + 검색어로 클라이언트 필터링 후 `ProductFormPickerOption[]`으로 매핑

#### product-create 탭 UI 구조
```
[상품명 입력]
[설명 입력]
─── 포함 옵션 선택 ───────────────────
  태그 필터 버튼: [전체] [hair] [nail] ...
  검색창: placeholder="옵션명 검색"
  체크박스 목록 (filteredOptions)
────────────────────────────────────
[대표 옵션 드롭다운]
[이미지 업로드]
```

#### `ProductFormFields` 호출 변경
```tsx
// 기존 (텍스트 입력 모드)
<ProductFormFields
  optionIdsText={optionIdsText}
  onOptionIdsTextChange={handleOptionIdsTextChange}
  optionIdModeLabels={optionIdModeLabels}
  ...
/>

// 변경 (체크박스 모드)
<ProductFormFields
  pickerOptions={filteredOptions}
  toggleProductOption={toggleProductOption}
  ...
/>
```

#### 성공 시 폼 초기화 대상 추가
- `setTagFilter("전체")`
- `setOptionSearch("")`
- `setProductOptionIds([])` (기존 유지)

---

## 데이터 흐름

```
useOptions() → OptionCatalogItem[]
      ↓
tagFilter + optionSearch로 클라이언트 필터링
      ↓
ProductFormPickerOption[] (id, name, price)
      ↓
ProductFormFields (체크박스 렌더링)
      ↓
toggleProductOption → productOptionIds[]
      ↓
handleCreateProduct → CreateProductRequest.optionIds
```

---

## 필터링 로직

```ts
const filteredOptions = allOptions
  .filter(o => tagFilter === "전체" || o.categoryTagName === tagFilter)
  .filter(o => o.name.includes(optionSearch.trim()))
  .map(o => ({ id: o.id, name: o.name, price: o.price }));
```

---

## 에러 / 엣지 케이스

| 케이스 | 처리 |
|--------|------|
| 옵션 로딩 중 | 체크박스 영역에 "로딩 중..." 표시 |
| 옵션 0개 (필터 결과 없음) | "조건에 맞는 옵션이 없습니다." 표시 |
| 옵션 선택 없이 제출 | 기존 `alert("옵션을 1개 이상 선택하세요.")` 유지 |
| 선택된 옵션이 필터로 숨겨진 경우 | 체크 상태 유지 (productOptionIds 기준, 시각적으로만 안 보임) |

---

## 변경하지 않는 것

- `handleCreateProduct` 로직 (productOptionIds → CreateProductRequest.optionIds)
- 대표 옵션 드롭다운 동작
- 상품 **수정** 탭 (AdminProductsPanel) — 기존 체크박스 모드 그대로
- `parseOptionIds.ts` — 더 이상 상품 생성에서 사용 안 하지만 파일 유지
