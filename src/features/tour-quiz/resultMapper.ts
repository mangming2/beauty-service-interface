import { QuizAnswers, QuizResult } from "@/features/tour-quiz/types";

type ResultTemplate = {
  region: string;
  mvTitle: string;
  mvLocation: string;
  relatedSpots: string[];
  restaurant: string;
  dessert: string;
  stay: string;
  copy: string;
  highlight: string;
  introLine?: string;
  narrative: string[];
  packageCtaTitle: string;
  packageCtaDescription: string;
};

const BASE_RESULTS: Record<string, ResultTemplate> = {
  "spring-day": {
    region: "강원도 강릉",
    mvTitle: "BTS - 봄날",
    mvLocation: "항호해변 빨간 버스 정류장",
    relatedSpots: ["주문진 수산시장"],
    restaurant: "강릉짬뽕순두부 성우회관",
    dessert: "순두부젤라또 주문진점",
    stay: "강릉 무아풀빌라",
    copy: "‘BTS- 봄날’ 감성의 여행을 좋아하는 당신, 한국의 새하얗고 포근한 겨울 바다를 기대하시는군요?",
    highlight: "겨울 바다의 공기와 소년 같은 여운",
    introLine: "소복하게 쌓인 눈와 촬영할 DOKI의 '겨울아이 스타일링 패키지'",
    narrative: [
      "하얀 눈 밭 위 홀로 서있는 볼 빨간 소녀, 누굴 기다리는지, 왜 홀로 이 겨울 바다를 서성이는지, 그 이야기를 궁금하게 하는 스타일링으로 '봄날' 뮤직비디오의 주인공이 되어보세요.",
      "이 여행의 몰입감과 만족도를 다른 차원으로 이끌어줄 DOKI의 '겨울아이 스타일링 패키지'를 확인하세요.",
    ],
    packageCtaTitle: "DOKI의 '겨울아이 스타일링 패키지'",
    packageCtaDescription:
      "하얀 겨울 바다와 빨간 버스 정류장 무드에 가장 잘 어울리는 스타일링 패키지예요.",
  },
  "hyyh-gyeongju": {
    region: "경북 경주",
    mvTitle: "BTS - 화양연화",
    mvLocation: "경주 보문관광단지",
    relatedSpots: ["황리단길", "동궁과 월지", "첨성대 야경 산책"],
    restaurant: "경주식 한우 불고기 정식",
    dessert: "황리단길 쑥 라떼와 찹쌀 디저트",
    stay: "호수 뷰 리조트",
    copy: "시간이 천천히 흐르는 장면을 좋아하는 당신에게는 경주의 잔잔한 호수와 오래된 도시의 결이 잘 어울려요. 익숙한 멜로디처럼 차분하게 오래 남는 여행이 될 거예요.",
    highlight: "고요한 호수와 클래식한 청춘 무드",
    narrative: [
      "보문호의 느린 반짝임과 경주의 고전적인 풍경은 화양연화의 정서를 길게 끌고 갑니다.",
      "차분한 도시의 리듬 위에 DOKI 스타일링을 더해 청춘 영화 같은 하루를 남겨보세요.",
    ],
    packageCtaTitle: "DOKI 클래식 무드 스타일링 패키지",
    packageCtaDescription:
      "경주의 잔잔한 호수와 오래된 도시 톤에 어울리는 차분한 패키지예요.",
  },
  "hyyh-jeju": {
    region: "제주",
    mvTitle: "BTS - 화양연화",
    mvLocation: "안돌오름 · 동너분덕",
    relatedSpots: ["성산일출봉", "섭지코지", "비자림 숲길"],
    restaurant: "제주 흑돼지와 고사리 한 상",
    dessert: "당근 케이크와 제주 말차 크림",
    stay: "오름 근처 스테이 하우스",
    copy: "넓은 초원과 바람의 결을 따라 걷는 장면이 좋다면, 당신의 여행은 제주에서 가장 자연스럽게 피어날 거예요. 프레임 밖까지 여운이 남는 풍경을 좋아하는 타입이에요.",
    highlight: "바람을 담는 들판과 영화 같은 원경",
    narrative: [
      "오름과 들판을 가르는 바람은 화면 밖까지 길게 이어지는 화양연화의 정서를 완성해줍니다.",
      "제주의 넓은 원경 위에 DOKI의 스타일링을 더해 프레임 같은 여행을 남겨보세요.",
    ],
    packageCtaTitle: "DOKI 제주 무드 스타일링 패키지",
    packageCtaDescription:
      "바람과 들판, 부드러운 원경이 살아나는 제주 촬영 무드용 패키지예요.",
  },
  "summer-package": {
    region: "전북 완주",
    mvTitle: "BTS - 서머패키지",
    mvLocation: "오성한옥마을",
    relatedSpots: ["소양 오성제", "위봉사", "삼례문화예술촌"],
    restaurant: "완주 한정식과 제철 나물 반상",
    dessert: "쌍화차와 한옥 디저트 플레이트",
    stay: "한옥 스테이",
    copy: "햇살이 부드럽게 스며드는 한옥 풍경을 좋아하는 당신에게는 완주의 여유가 잘 맞아요. 복잡한 일정보다, 하루를 길게 음미하는 방식이 더 어울리는 여행자예요.",
    highlight: "한옥의 결, 느긋한 햇살, 잔잔한 쉼",
    narrative: [
      "완주의 한옥과 느긋한 여름빛은 복잡한 일정 없이도 하루를 꽉 차게 만듭니다.",
      "DOKI 스타일링 패키지와 함께 한옥 마을의 결을 더 또렷하게 남겨보세요.",
    ],
    packageCtaTitle: "DOKI 한옥 무드 스타일링 패키지",
    packageCtaDescription:
      "오성한옥마을의 여름빛과 잘 어울리는 단정하고 감각적인 패키지예요.",
  },
};

const STYLING_BY_OPTION: Record<string, string> = {
  "winter-kid": "DOKI 겨울아이 스타일링 패키지",
  "spring-boyish": "DOKI 봄날 소년미 스타일링 패키지",
};

const DINNER_BY_OPTION: Record<string, string> = {
  "raw-fish": "시장에서 직접 고른 해산물을 바로 회 떠먹기",
  "jjamppong-soondubu": "강릉짬뽕순두부 성우회관",
  samgyeopsal: "현지식 생삼겹살 저녁",
  "snow-crab": "동해안 대게찜 코스",
  "gyeongju-bulgogi": "경주식 한우 불고기 정식",
  "gyeongju-ssambap": "향긋한 경주 쌈밥 한 상",
  "jeju-black-pork": "제주 흑돼지 한 상",
  "jeju-seafood-noodle": "제주 해산물 국수",
  "wanju-hanjeongsik": "완주 한정식과 제철 나물 반상",
  "wanju-tofu": "따뜻한 두부전골과 로컬 반찬",
};

const STAY_BY_OPTION: Record<string, string> = {
  "ocean-hotel": "오션뷰 4성급 호텔",
  "mua-poolvilla": "강릉 무아풀빌라",
  glamping: "자연 속 글램핑장",
  guesthouse: "가성비 게스트하우스",
  "lake-resort": "호수 뷰 리조트",
  "gyeongju-hanok": "경주 한옥 스테이",
  "oreum-stay": "오름 근처 스테이 하우스",
  "jeju-seaview-pension": "제주 바다 전망 펜션",
  "osung-hanok-stay": "오성한옥마을 한옥 스테이",
  "wanju-forest-stay": "완주 자연 속 스테이",
};

const SPOT_OVERRIDE_BY_OPTION: Record<string, string[]> = {
  "flea-market": ["감성 플리마켓"],
  "fish-market": ["주문진 수산시장"],
  "bomun-lake-walk": ["보문호 산책로"],
  "donggung-night-view": ["동궁과 월지 야경"],
  "oreum-photo-spot": ["안돌오름 포토 스팟"],
  "jeju-field-drive": ["동너분덕 드라이브 코스"],
  "hanok-village-walk": ["오성한옥마을 골목 산책"],
  "samrye-art": ["삼례문화예술촌"],
};

export function getQuizResult(answers: QuizAnswers): QuizResult | null {
  const destination = answers.q1;
  const styling = answers.q2;

  if (!destination || !styling) {
    return null;
  }

  const base = BASE_RESULTS[destination];
  if (!base) {
    return null;
  }

  const relatedSpots = answers.q3
    ? (SPOT_OVERRIDE_BY_OPTION[answers.q3] ?? base.relatedSpots)
    : base.relatedSpots;

  const restaurant = answers.q4
    ? (DINNER_BY_OPTION[answers.q4] ?? base.restaurant)
    : base.restaurant;

  const stay = answers.q5
    ? (STAY_BY_OPTION[answers.q5] ?? base.stay)
    : base.stay;
  const stylingPackage =
    STYLING_BY_OPTION[styling] ?? "DOKI 시그니처 스타일링 패키지";

  return {
    ...base,
    relatedSpots,
    restaurant,
    stay,
    stylingPackage,
    shareTitle: `DOKI BTS MV TRIP · ${base.region}`,
  };
}
