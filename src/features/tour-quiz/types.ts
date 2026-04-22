export type QuizQuestionId = "q1" | "q2" | "q3" | "q4" | "q5";

export type QuizOptionId =
  | "spring-day"
  | "hyyh-gyeongju"
  | "hyyh-jeju"
  | "summer-package"
  | "winter-kid"
  | "spring-boyish"
  | "flea-market"
  | "fish-market"
  | "raw-fish"
  | "jjamppong-soondubu"
  | "samgyeopsal"
  | "snow-crab"
  | "ocean-hotel"
  | "mua-poolvilla"
  | "glamping"
  | "guesthouse"
  | "bomun-lake-walk"
  | "donggung-night-view"
  | "gyeongju-bulgogi"
  | "gyeongju-ssambap"
  | "lake-resort"
  | "gyeongju-hanok"
  | "oreum-photo-spot"
  | "jeju-field-drive"
  | "jeju-black-pork"
  | "jeju-seafood-noodle"
  | "oreum-stay"
  | "jeju-seaview-pension"
  | "hanok-village-walk"
  | "samrye-art"
  | "wanju-hanjeongsik"
  | "wanju-tofu"
  | "osung-hanok-stay"
  | "wanju-forest-stay";

export type QuizAnswers = Partial<Record<QuizQuestionId, QuizOptionId>>;

export type QuizOption = {
  id: QuizOptionId;
  label: string;
  description?: string;
  badge?: string;
  visualTitle?: string;
  visualSubtitle?: string;
  visualTheme?: "pink" | "violet" | "blue" | "emerald" | "amber";
};

export type QuizQuestion = {
  id: QuizQuestionId;
  step: number;
  eyebrow: string;
  title: string;
  subtitle?: string;
  options: QuizOption[];
  dependsOn?: Partial<Record<QuizQuestionId, QuizOptionId[]>>;
};

export type QuizResult = {
  region: string;
  mvTitle: string;
  mvLocation: string;
  relatedSpots: string[];
  restaurant: string;
  dessert: string;
  stay: string;
  stylingPackage: string;
  shareTitle: string;
  copy: string;
  highlight: string;
  introLine?: string;
  narrative: string[];
  packageCtaTitle: string;
  packageCtaDescription: string;
};
