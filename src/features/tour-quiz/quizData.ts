import { QuizOptionId, QuizQuestion } from "@/features/tour-quiz/types";

type DestinationId =
  | "spring-day"
  | "hyyh-gyeongju"
  | "hyyh-jeju"
  | "summer-package";

const q1Question: QuizQuestion = {
  id: "q1",
  step: 1,
  eyebrow: "MV Destination",
  title: "어떤 뮤비 촬영지로 떠나볼까요?",
  subtitle: "좋아하는 장면의 공기와 색감을 먼저 골라보세요.",
  options: [
    {
      id: "spring-day",
      label: "BTS - 봄날",
      description:
        "강원도 강릉 주문진 해수욕장 · 항호해변입구 빨간 버스 정류장",
      badge: "Winter Sea",
      visualTitle: "항호해변입구 빨간 버스 정류장",
      visualSubtitle: "강원도 강릉 주문진 해수욕장",
      visualTheme: "pink",
    },
    {
      id: "hyyh-gyeongju",
      label: "BTS - 화양연화",
      description: "경북 경주 보문관광단지",
      badge: "Classic Mood",
      visualTitle: "경북 경주 보문관광단지",
      visualSubtitle: "호수와 클래식한 청춘 무드",
      visualTheme: "violet",
    },
    {
      id: "hyyh-jeju",
      label: "BTS - 화양연화",
      description: "제주 안돌오름 · 동너분덕",
      badge: "Volcanic Field",
      visualTitle: "제주 안돌오름 · 동너분덕",
      visualSubtitle: "바람을 담는 제주 초원",
      visualTheme: "blue",
    },
    {
      id: "summer-package",
      label: "BTS - 서머패키지",
      description: "완주 오성한옥마을",
      badge: "Hanok Stay",
      visualTitle: "완주 오성한옥마을",
      visualSubtitle: "한옥과 여름빛의 쉼표",
      visualTheme: "amber",
    },
  ],
};

const q2Question: QuizQuestion = {
  id: "q2",
  step: 2,
  eyebrow: "DOKI Styling",
  title: "어떤 컨셉으로 기록을 남겨볼까요?",
  subtitle: "여행 무드와 함께 가져갈 스타일링을 골라보세요.",
  options: [
    {
      id: "winter-kid",
      label: "한겨울의 아련함",
      description: "니트와 털모자 스타일링 → DOKI 겨울아이 스타일링 패키지",
      badge: "Soft Layered",
      visualTitle: "겨울아이 스타일링",
      visualSubtitle: "니트와 털모자, 새하얀 겨울 무드",
      visualTheme: "blue",
    },
    {
      id: "spring-boyish",
      label: "봄날의 소년미",
      description: "반바지와 스트라이프 스타일링",
      badge: "Boyish Stripe",
      visualTitle: "소년미 스타일링",
      visualSubtitle: "반바지와 스트라이프의 가벼운 무드",
      visualTheme: "emerald",
    },
  ],
};

const branchQuestionsByDestination: Record<DestinationId, QuizQuestion[]> = {
  "spring-day": [
    {
      id: "q3",
      step: 3,
      eyebrow: "Jumunjin Stop",
      title: "주문진 바닷가 도착! 하나만 갈 수 있다면?",
      subtitle: "봄날의 여운을 더 깊게 남길 동선을 고르는 순간이에요.",
      options: [
        {
          id: "flea-market",
          label: "편하고 깔끔한 신식 플리마켓",
          description: "아기자기한 디저트와 감성샷 남기기",
          badge: "Clean Mood",
          visualTitle: "플리마켓 & 디저트",
          visualSubtitle: "정돈된 감성에서 사진 남기기",
          visualTheme: "pink",
        },
        {
          id: "fish-market",
          label: "북적이는 진짜 수산시장",
          description: "주문진 수산시장에서 authentic 한국 만나기",
          badge: "Local Energy",
          visualTitle: "주문진 수산시장",
          visualSubtitle: "authentic 한국의 현장감",
          visualTheme: "amber",
        },
      ],
    },
    {
      id: "q4",
      step: 4,
      eyebrow: "Dinner Route",
      title: "여행은 역시 식도락! 저녁으로 뭐먹지?",
      subtitle: "강릉에서의 저녁 무드를 정해보세요.",
      options: [
        {
          id: "raw-fish",
          label: "시장 해산물 바로 회 떠먹기",
          description: "시장에서 직접 고른 해산물을 바로 회 떠먹자!",
          visualTitle: "시장 회 코스",
          visualSubtitle: "가장 현지다운 바다 저녁",
          visualTheme: "blue",
        },
        {
          id: "jjamppong-soondubu",
          label: "강원도는 역시 순두부지",
          description: "칼칼한 짬뽕 순두부! → 강릉짬뽕순두부 성우회관",
          visualTitle: "짬뽕 순두부",
          visualSubtitle: "강릉 대표 칼칼한 한 끼",
          visualTheme: "amber",
        },
        {
          id: "samgyeopsal",
          label: "한국에 왔으면 당연히 K-bbq지",
          description: "생삼겹살!",
          visualTitle: "K-BBQ 생삼겹살",
          visualSubtitle: "한국 여행 저녁의 정석",
          visualTheme: "emerald",
        },
        {
          id: "snow-crab",
          label: "대게 정돈 잡아줘야 바다 여행 아니겠어?",
          description: "대게찜!",
          visualTitle: "동해안 대게찜",
          visualSubtitle: "바다 여행의 제대로 된 피날레",
          visualTheme: "violet",
        },
      ],
    },
    {
      id: "q5",
      step: 5,
      eyebrow: "Stay Choice",
      title: "잘 먹었다~ 이제 숙소에서 쉴 시간.",
      subtitle: "오늘의 촬영지가 머무는 방식까지 완성합니다.",
      options: [
        {
          id: "ocean-hotel",
          label: "속이 탁 트이는 지평선",
          description: "오션뷰 4성급 호텔",
          visualTitle: "오션뷰 4성급 호텔",
          visualSubtitle: "지평선과 함께 쉬는 밤",
          visualTheme: "blue",
        },
        {
          id: "mua-poolvilla",
          label: "개성 있는 감각적 인테리어와 서비스의 독채 펜션",
          description: "→ 강릉 무아풀빌라",
          visualTitle: "강릉 무아풀빌라",
          visualSubtitle: "감각적인 독채 스테이",
          visualTheme: "pink",
        },
        {
          id: "glamping",
          label: "강원도의 선물, 자연 속의 하루",
          description: "글램핑장",
          visualTitle: "자연 속 글램핑장",
          visualSubtitle: "바람과 밤공기를 가까이",
          visualTheme: "emerald",
        },
        {
          id: "guesthouse",
          label: "무조건 가성비!",
          description: "최저가 게스트하우스",
          visualTitle: "가성비 게스트하우스",
          visualSubtitle: "가볍고 실속 있는 선택",
          visualTheme: "violet",
        },
      ],
    },
  ],
  "hyyh-gyeongju": [
    {
      id: "q3",
      step: 3,
      eyebrow: "Gyeongju Stop",
      title: "경주에 도착했다면 어디부터 들를까요?",
      subtitle: "호수의 여운과 오래된 도시의 결 중 하나를 골라보세요.",
      options: [
        {
          id: "bomun-lake-walk",
          label: "보문호 주변 산책로를 천천히 걷기",
          description: "잔잔한 물결과 클래식한 풍경에 머물기",
          visualTitle: "보문호 산책",
          visualSubtitle: "고요한 호수의 리듬",
          visualTheme: "violet",
        },
        {
          id: "donggung-night-view",
          label: "동궁과 월지 야경까지 보고 오기",
          description: "조명이 비치는 경주의 밤 감상하기",
          visualTitle: "동궁과 월지",
          visualSubtitle: "빛이 번지는 경주의 밤",
          visualTheme: "amber",
        },
      ],
    },
    {
      id: "q4",
      step: 4,
      eyebrow: "Dinner Route",
      title: "경주에서의 저녁, 어떤 한 끼가 좋을까요?",
      subtitle: "도시의 온도에 어울리는 메뉴를 골라보세요.",
      options: [
        {
          id: "gyeongju-bulgogi",
          label: "경주식 한우 불고기 정식",
          description: "차분하고 든든한 저녁 코스",
          visualTitle: "한우 불고기 정식",
          visualSubtitle: "경주의 클래식한 한 상",
          visualTheme: "amber",
        },
        {
          id: "gyeongju-ssambap",
          label: "향긋한 경주 쌈밥 한 상",
          description: "여러 반찬과 함께 즐기는 로컬 식사",
          visualTitle: "경주 쌈밥",
          visualSubtitle: "정갈하고 풍성한 한 상",
          visualTheme: "emerald",
        },
      ],
    },
    {
      id: "q5",
      step: 5,
      eyebrow: "Stay Choice",
      title: "오늘 밤 경주는 어떤 방식으로 머물까요?",
      subtitle: "호수 뷰와 한옥 감성 중에서 골라보세요.",
      options: [
        {
          id: "lake-resort",
          label: "호수 뷰 리조트",
          description: "조용한 아침 풍경까지 이어지는 숙소",
          visualTitle: "레이크 리조트",
          visualSubtitle: "보문호를 가까이 누리는 밤",
          visualTheme: "blue",
        },
        {
          id: "gyeongju-hanok",
          label: "경주 한옥 스테이",
          description: "도시의 시간감을 오래 머금는 선택",
          visualTitle: "경주 한옥 스테이",
          visualSubtitle: "고즈넉한 결의 숙소",
          visualTheme: "amber",
        },
      ],
    },
  ],
  "hyyh-jeju": [
    {
      id: "q3",
      step: 3,
      eyebrow: "Jeju Stop",
      title: "제주의 들판에 서 있다면 어디로 향할까요?",
      subtitle: "장면의 결을 더 깊게 남길 장소를 골라보세요.",
      options: [
        {
          id: "oreum-photo-spot",
          label: "오름 능선 따라 포토 스팟 찾기",
          description: "바람과 원경이 가장 잘 담기는 위치로 이동",
          visualTitle: "오름 포토 스팟",
          visualSubtitle: "바람을 담는 능선 위",
          visualTheme: "blue",
        },
        {
          id: "jeju-field-drive",
          label: "들판을 가로지르는 드라이브 코스",
          description: "초원과 길이 이어지는 제주만의 프레임",
          visualTitle: "제주 필드 드라이브",
          visualSubtitle: "길 위에서 만나는 제주 원경",
          visualTheme: "emerald",
        },
      ],
    },
    {
      id: "q4",
      step: 4,
      eyebrow: "Dinner Route",
      title: "제주에서의 저녁은 무엇이 좋을까요?",
      subtitle: "제주의 온도와 질감을 닮은 메뉴를 고르세요.",
      options: [
        {
          id: "jeju-black-pork",
          label: "제주 흑돼지 한 상",
          description: "여행의 만족도를 확실히 올려주는 대표 메뉴",
          visualTitle: "제주 흑돼지",
          visualSubtitle: "제주에서 놓칠 수 없는 한 끼",
          visualTheme: "amber",
        },
        {
          id: "jeju-seafood-noodle",
          label: "제주 해산물 국수",
          description: "맑고 시원한 바다 풍미의 저녁",
          visualTitle: "해산물 국수",
          visualSubtitle: "제주 바다의 가벼운 한 그릇",
          visualTheme: "blue",
        },
      ],
    },
    {
      id: "q5",
      step: 5,
      eyebrow: "Stay Choice",
      title: "제주의 밤은 어디에서 마무리할까요?",
      subtitle: "오름 근처의 차분함과 바다 쪽의 여유 중 선택해보세요.",
      options: [
        {
          id: "oreum-stay",
          label: "오름 근처 스테이 하우스",
          description: "다음 날까지 조용한 여운이 이어지는 숙소",
          visualTitle: "오름 스테이",
          visualSubtitle: "제주의 조용한 밤 공기",
          visualTheme: "emerald",
        },
        {
          id: "jeju-seaview-pension",
          label: "제주 바다 전망 펜션",
          description: "탁 트인 풍경과 함께 쉬는 밤",
          visualTitle: "씨뷰 펜션",
          visualSubtitle: "제주 바다와 함께 마무리",
          visualTheme: "blue",
        },
      ],
    },
  ],
  "summer-package": [
    {
      id: "q3",
      step: 3,
      eyebrow: "Wanju Stop",
      title: "완주 오성한옥마을에 도착했다면 어디를 즐길까요?",
      subtitle: "한옥의 결을 더 느낄지, 주변 동선으로 넓힐지 골라보세요.",
      options: [
        {
          id: "hanok-village-walk",
          label: "한옥마을 골목을 천천히 걷기",
          description: "고요한 마을의 결을 오래 남기는 선택",
          visualTitle: "한옥마을 산책",
          visualSubtitle: "느리게 걷는 완주의 오후",
          visualTheme: "amber",
        },
        {
          id: "samrye-art",
          label: "삼례문화예술촌까지 함께 들르기",
          description: "조금 더 다채로운 완주 동선 즐기기",
          visualTitle: "삼례문화예술촌",
          visualSubtitle: "감각적인 완주 확장 코스",
          visualTheme: "violet",
        },
      ],
    },
    {
      id: "q4",
      step: 4,
      eyebrow: "Dinner Route",
      title: "완주에서의 저녁은 어떤 한 끼가 좋을까요?",
      subtitle: "한옥과 잘 어울리는 식사 무드를 골라보세요.",
      options: [
        {
          id: "wanju-hanjeongsik",
          label: "완주 한정식과 제철 나물 반상",
          description: "단정하고 풍성한 지역 한 상",
          visualTitle: "완주 한정식",
          visualSubtitle: "한옥과 잘 어울리는 식사",
          visualTheme: "amber",
        },
        {
          id: "wanju-tofu",
          label: "따뜻한 두부전골과 로컬 반찬",
          description: "포근한 밤공기와 어울리는 저녁",
          visualTitle: "두부전골",
          visualSubtitle: "따뜻하게 마무리하는 한 끼",
          visualTheme: "emerald",
        },
      ],
    },
    {
      id: "q5",
      step: 5,
      eyebrow: "Stay Choice",
      title: "완주의 밤은 어떤 공간에서 쉬고 싶나요?",
      subtitle: "한옥 감성의 연장선 또는 자연 속 고요함을 골라보세요.",
      options: [
        {
          id: "osung-hanok-stay",
          label: "오성한옥마을 한옥 스테이",
          description: "머무는 순간까지 한옥 무드를 이어가기",
          visualTitle: "오성한옥 스테이",
          visualSubtitle: "한옥의 결을 오래 남기는 밤",
          visualTheme: "amber",
        },
        {
          id: "wanju-forest-stay",
          label: "완주 자연 속 스테이",
          description: "조용한 밤공기와 함께 쉬는 숙소",
          visualTitle: "포레스트 스테이",
          visualSubtitle: "조용한 완주의 밤",
          visualTheme: "emerald",
        },
      ],
    },
  ],
};

export function getQuizQuestions(destination?: QuizOptionId): QuizQuestion[] {
  const sequence = [q1Question, q2Question];

  if (destination && destination in branchQuestionsByDestination) {
    return [
      ...sequence,
      ...branchQuestionsByDestination[destination as DestinationId],
    ];
  }

  return sequence;
}
