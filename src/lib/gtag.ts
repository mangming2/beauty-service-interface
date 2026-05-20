declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

function track(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, params);
}

// Priority 1 — 핵심 전환
export const gtag = {
  loginSuccess: (method: string = "google") => track("login", { method }),

  reservationView: (packageId: number, optionId?: number) =>
    track("reservation_view", { package_id: packageId, option_id: optionId }),

  reservationComplete: (packageId: number, optionId: number, price: number) =>
    track("reservation_complete", {
      package_id: packageId,
      option_id: optionId,
      value: price,
      currency: "KRW",
    }),

  // Priority 2 — 예약 퍼널
  packageView: (packageId: number, packageName: string) =>
    track("package_view", { package_id: packageId, package_name: packageName }),

  optionSelect: (packageId: number, optionId: number, optionName: string) =>
    track("option_select", {
      package_id: packageId,
      option_id: optionId,
      option_name: optionName,
    }),

  dateSelect: (
    packageId: number,
    optionId: number,
    date: string,
    time: string
  ) =>
    track("date_select", {
      package_id: packageId,
      option_id: optionId,
      date,
      time,
    }),

  wishToggle: (packageId: number, action: "add" | "remove") =>
    track("wish_toggle", { package_id: packageId, action }),

  // Priority 3 — 사용자 행동
  searchPerformed: (query: string) => track("search", { search_term: query }),

  reviewSubmit: (packageId: number, rating: number) =>
    track("review_submit", { package_id: packageId, rating }),

  formStepComplete: (step: number) => track("form_step_complete", { step }),

  // Priority 4 — 커뮤니티
  postLike: (postId: number) => track("post_like", { post_id: postId }),

  commentCreate: (postId: number) =>
    track("comment_create", { post_id: postId }),

  postCreate: (tags: string[]) =>
    track("post_create", { tags: tags.join(",") }),
};
