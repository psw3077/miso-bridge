export type Product = {
  id: string;
  name: string;
  category: string;
  origin: string;
  alcohol?: string;
  volume?: string;
  description: string;
  tags: string[];
};

export const products: Product[] = [
  { id: "yantai", name: "연태고량주", category: "중국주류", origin: "중국", alcohol: "34%", volume: "500ml", description: "중식·양꼬치 업종에서 꾸준히 찾는 대표 중국 백주입니다.", tags: ["연태", "고량주", "중국술", "양꼬치", "훠궈"] },
  { id: "yantai-premium", name: "연태 프리미엄", category: "중국주류", origin: "중국", alcohol: "38%", description: "연태 계열의 프리미엄 제품으로 중식 다이닝과 선물 수요에 제안하기 좋습니다.", tags: ["연태", "프리미엄", "중국술", "백주"] },
  { id: "yantai-green", name: "연태그린", category: "중국주류", origin: "중국", description: "연태 브랜드를 찾는 업장에서 함께 문의가 많은 중국 백주 제품입니다.", tags: ["연태", "연태그린", "중국술"] },
  { id: "wuliangye", name: "우량예", category: "중국주류", origin: "중국", description: "중국을 대표하는 고급 백주 브랜드 중 하나입니다.", tags: ["우량예", "중국술", "백주"] },
  { id: "kongming", name: "공명주", category: "중국주류", origin: "중국", description: "중식·양꼬치 업종의 중국주류 구성을 다양화할 때 제안할 수 있습니다.", tags: ["공명주", "중국술", "백주"] },
  { id: "xifeng", name: "서봉주", category: "중국주류", origin: "중국", description: "중국의 대표적인 백주 브랜드 중 하나로 다양한 라인업을 취급합니다.", tags: ["서봉주", "중국술", "백주"] },
  { id: "ulan", name: "우란산 고량주", category: "중국주류", origin: "중국", alcohol: "56%", volume: "250ml", description: "높은 도수와 강한 개성이 특징인 중국 고량주입니다.", tags: ["우란산", "고량주", "56도", "중국술"] },
  { id: "guyue", name: "고월용산 소흥주", category: "중국주류", origin: "중국", description: "중식 요리와 함께 제안하기 좋은 대표적인 소흥주 계열 제품입니다.", tags: ["고월용산", "소흥주", "중국술"] },
  { id: "tsingtao", name: "칭따오", category: "수입맥주", origin: "중국", alcohol: "4.7%", volume: "500ml", description: "깔끔한 라거 스타일의 대표 중국 맥주입니다.", tags: ["칭따오", "맥주", "중국맥주"] },
  { id: "harbin", name: "하얼빈", category: "수입맥주", origin: "중국", description: "중국 대표 라거 브랜드 중 하나로 다양한 중식 업종에서 찾습니다.", tags: ["하얼빈", "맥주", "중국맥주"] },
  { id: "tiger", name: "타이거맥주", category: "수입맥주", origin: "싱가포르", description: "동남아 음식점과 펍에서 폭넓게 제안할 수 있는 라거 맥주입니다.", tags: ["타이거", "타이거맥주", "수입맥주"] },
  { id: "snow", name: "설화맥주", category: "수입맥주", origin: "중국", description: "중국 음식점과 양꼬치 업종에서 함께 구성하기 좋은 중국 맥주입니다.", tags: ["설화", "설화맥주", "중국맥주"] },
  { id: "cass", name: "카스", category: "국산주류", origin: "대한민국", description: "국내 외식업에서 폭넓게 취급되는 대표 라거입니다.", tags: ["카스", "맥주", "국산맥주"] },
  { id: "terra", name: "테라", category: "국산주류", origin: "대한민국", description: "외식업 채널에서 폭넓게 판매되는 국산 라거입니다.", tags: ["테라", "맥주", "국산맥주"] },
  { id: "hanmac", name: "한맥", category: "국산주류", origin: "대한민국", description: "음식과 함께 즐기는 콘셉트로 외식업장에서 취급되는 국산 맥주입니다.", tags: ["한맥", "맥주", "국산맥주"] },
  { id: "kelly", name: "켈리", category: "국산주류", origin: "대한민국", description: "국내 음식점과 주점에서 취급되는 국산 라거 브랜드입니다.", tags: ["켈리", "맥주", "국산맥주"] },
  { id: "kloud", name: "클라우드", category: "국산주류", origin: "대한민국", description: "국내 외식업장에서 선택할 수 있는 국산 맥주 브랜드입니다.", tags: ["클라우드", "맥주", "국산맥주"] },
  { id: "chamisul", name: "참이슬", category: "국산주류", origin: "대한민국", description: "국내 음식점에서 폭넓게 취급되는 대표 소주입니다.", tags: ["참이슬", "소주"] },
  { id: "cheoeum", name: "처음처럼", category: "국산주류", origin: "대한민국", description: "다양한 외식업장에서 취급되는 국산 소주입니다.", tags: ["처음처럼", "소주"] },
  { id: "saero", name: "새로", category: "국산주류", origin: "대한민국", description: "제로 슈거 콘셉트로 알려진 국산 소주입니다.", tags: ["새로", "소주"] },
  { id: "jinro", name: "진로", category: "국산주류", origin: "대한민국", description: "레트로 감성과 함께 음식점·주점에서 폭넓게 취급되는 소주입니다.", tags: ["진로", "소주"] },
  { id: "goldenblue", name: "골든블루", category: "위스키", origin: "대한민국", description: "국내 업소용 시장에서 인지도가 높은 위스키 브랜드입니다.", tags: ["골든블루", "위스키"] },
  { id: "scotchblue17", name: "스카치블루 17년", category: "위스키", origin: "대한민국", description: "국내 유흥·외식 채널에서 오랫동안 알려진 위스키 라인입니다.", tags: ["스카치블루", "17년", "위스키"] },
  { id: "johnniewalker", name: "조니워커", category: "위스키", origin: "스코틀랜드", description: "세계적으로 널리 알려진 블렌디드 스카치 위스키 브랜드입니다.", tags: ["조니워커", "위스키", "스카치"] },
  { id: "ballantines", name: "발렌타인", category: "위스키", origin: "스코틀랜드", description: "인지도가 높은 블렌디드 스카치 위스키 브랜드입니다.", tags: ["발렌타인", "위스키", "스카치"] },
  { id: "penelope", name: "페넬로페 버번", category: "위스키", origin: "미국", description: "버번 위스키 선택지를 넓히고 싶은 업장에 제안할 수 있는 브랜드입니다.", tags: ["페넬로페", "버번", "위스키"] },
  { id: "bardstown", name: "바즈타운 버번", category: "위스키", origin: "미국", description: "버번·아메리칸 위스키 구성을 강화할 때 검토할 수 있는 제품입니다.", tags: ["바즈타운", "버번", "위스키"] },
  { id: "sake", name: "사케", category: "사케", origin: "일본", description: "준마이·긴죠·다이긴죠 등 다양한 스타일을 업종에 맞게 제안합니다.", tags: ["사케", "준마이", "긴죠", "다이긴죠"] },
  { id: "shichiken", name: "시치켄 스파클링", category: "사케", origin: "일본", description: "스파클링 스타일 사케를 찾는 업장에 제안할 수 있는 제품입니다.", tags: ["시치켄", "스파클링", "사케"] },
  { id: "shikishima", name: "시키시마 유메산스이", category: "사케", origin: "일본", description: "일식·이자카야 주류 구성을 다양화할 때 검토할 수 있는 사케입니다.", tags: ["시키시마", "유메산스이", "사케"] },
  { id: "wine", name: "와인", category: "와인", origin: "다양", description: "레드·화이트·스파클링 등 업종과 메뉴에 맞는 와인을 제안합니다.", tags: ["와인", "레드와인", "화이트와인", "스파클링"] },
  { id: "twohands", name: "투핸즈 엔젤스 쉐어 쉬라즈", category: "와인", origin: "호주", description: "진한 스타일의 쉬라즈를 찾는 레스토랑과 다이닝에 제안할 수 있습니다.", tags: ["투핸즈", "엔젤스쉐어", "쉬라즈", "와인"] },
  { id: "russianjack", name: "러시안 잭", category: "와인", origin: "뉴질랜드", description: "뉴질랜드 와인을 찾는 업장에 제안할 수 있는 브랜드입니다.", tags: ["러시안잭", "뉴질랜드", "와인"] },
  { id: "draft", name: "생맥주", category: "생맥주", origin: "다양", description: "업장 환경에 맞는 생맥주 공급과 시스템 상담을 지원합니다.", tags: ["생맥주", "케그", "호프"] },
  { id: "korean-draft", name: "국산 생맥주", category: "생맥주", origin: "대한민국", description: "업종·회전율·설비 환경에 맞는 국산 생맥주 구성을 상담합니다.", tags: ["국산생맥주", "생맥주", "케그"] },
  { id: "import-draft", name: "수입 생맥주", category: "생맥주", origin: "다양", description: "수입 케그와 전용 설비가 필요한 업장을 위한 상담을 제공합니다.", tags: ["수입생맥주", "생맥주", "케그"] },
  { id: "traditional", name: "전통주", category: "전통주", origin: "대한민국", description: "한식·다이닝 콘셉트에 맞는 전통주 구성을 제안합니다.", tags: ["전통주", "한식", "막걸리", "약주"] },
];

export const categories = ["전체", "국산주류", "중국주류", "수입맥주", "위스키", "사케", "와인", "생맥주", "전통주"];
