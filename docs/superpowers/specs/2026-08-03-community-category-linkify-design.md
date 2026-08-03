# 커뮤니티 카테고리 필수화 + 전체 탭 + 본문 하이퍼링크

## 배경

- 커뮤니티 글쓰기(`src/app/board/community/write/page.tsx`)는 카테고리(태그) 선택이 선택 사항이라, 태그 없이 등록된 글은 목록 페이지의 태그 필터 탭(Recruiting/K-pop News/K-Beauty)에서 전혀 노출되지 않는다. hot 탭에 인기글로 뜨는 경우가 아니면 사실상 유실된다.
- 백엔드(`DOKI_BE`) 확인 결과, `tag` 파라미터를 생략하면 `CommunityPostQueryRepository`가 태그 조건 없이 전체 비삭제 게시물을 반환한다(`CommunityPostQueryService.kt:29`, `CommunityPostQueryRepository.kt:190-254`). 페이지네이션/인덱스도 태그 필터 유무와 무관하게 동일하게 동작하며, `"all"`이라는 예약된 태그 값도 없다.
- 게시글 상세(커뮤니티 `[id]/page.tsx`, 공지사항 `notice/[id]/page.tsx`)는 본문을 순수 텍스트로 렌더링 중이라(`dangerouslySetInnerHTML` 미사용) URL 텍스트가 그냥 문자열로만 보인다.

## 변경 사항

### 1. 카테고리 필수 선택 (write 페이지)

파일: `src/app/board/community/write/page.tsx`

- Complete 버튼 `disabled` 조건에 `selectedTags.length === 0` 추가.
- `handleSubmit` 최상단 가드에도 동일 조건 추가.
- 카테고리 선택 안내 문구("카테고리를 선택해주세요") 아래에, 카테고리 미선택 상태에서 사용자가 인지할 수 있도록 에러 문구(예: "카테고리를 1개 이상 선택해주세요")를 추가로 표시한다. 문구는 태그가 하나도 선택되지 않았을 때만 노출한다(선택 즉시 사라짐). 별도 토스트는 사용하지 않는다.

### 2. "전체" 탭 추가 (목록 페이지)

파일: `src/app/board/page.tsx`, `src/locales/translations.ts`

- `COMMUNITY_CATEGORIES` 배열 맨 앞에 `{ id: "all", label: "communityPage.all", isHot: false }` 추가.
- 렌더링 분기 수정:
  - `activeCat.isHot` → `HotCommunityTab` (기존 그대로)
  - `activeCategory === "all"` → `TaggedCommunityTab`을 `tag` 파라미터 없이 호출 (백엔드에 `tag` 자체를 전달하지 않음 — `tag: "all"` 문자열을 보내는 게 아님)
  - 그 외 → 기존 태그 필터 그대로
- 기본 진입 탭(`useState<CategoryId>(...)`)을 `"hot"`에서 `"all"`로 변경.
- `translations.ts`의 각 로케일 블록(최소 4곳)에 `communityPage.all` 라벨 키 추가 (한국어: "전체").
- write 페이지의 `PRESET_TAGS`는 그대로 둔다 ("전체"는 글쓰기 시 실제로 붙일 수 있는 태그가 아니라 목록 필터 전용 개념이므로 글쓰기 화면에는 추가하지 않음).

### 3. 본문 URL 하이퍼링크

새 유틸: `src/lib/linkify.tsx` (또는 `src/lib/utils.ts`에 함수 추가 — 구현 시 기존 파일 컨벤션에 맞춰 배치)

- `linkifyText(text: string): ReactNode[]` — 정규식으로 `http(s)://...` 및 프로토콜 없는 `www.xxx.xxx` 패턴을 매치해 일반 텍스트와 링크 세그먼트로 분리한 React 노드 배열을 반환한다.
- 매치된 세그먼트는 `<a>` 엘리먼트로 렌더링:
  - `href`: 원문이 `www.`로 시작하면 `https://`를 붙이고, 이미 `http(s)://`로 시작하면 그대로 사용.
  - `target="_blank" rel="noopener noreferrer"`
  - 스타일: `text-primary underline` (`--primary: #f92595`, 기존 globals.css 토큰 그대로 사용)
- 텍스트가 아닌 부분(일반 문장)은 그대로 렌더링하고, `whitespace-pre-wrap` 등 기존 컨테이너 스타일은 유지.
- 적용 위치 2곳, 둘 다 기존 `{post.content}` 텍스트 렌더링을 `{linkifyText(post.content)}`로 교체:
  - `src/app/board/community/[id]/page.tsx` (커뮤니티 상세 본문)
  - `src/app/board/notice/[id]/page.tsx` (공지사항 상세 본문)
- 댓글 본문에는 적용하지 않는다 (게시글 본문만).
- 외부 라이브러리(linkifyjs 등)는 추가하지 않고 직접 구현한다 (현재 package.json에 관련 라이브러리 없음, 정규식 기반으로 충분).

## 범위 제외

- 글쓰기 화면 자체에 "전체" 태그 옵션 추가하지 않음 (필터 전용 개념).
- 댓글/답글 본문 하이퍼링크 처리하지 않음.
- 카테고리 필수화에 토스트/모달 등 추가 UI 컴포넌트 도입하지 않음 — 기존 인라인 텍스트 패턴 재사용.
