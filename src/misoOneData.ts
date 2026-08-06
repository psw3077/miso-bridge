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
  { id: "tsingtao", name: "칭따오", category: "수입맥주", origin: "중국", alcohol: "4.7%", volume: "500ml", description: "깔끔한 라거 스타일의 대표 중국 맥주입니다.", tags: ["칭따오", "맥주", "중국맥주"] },
  { id: "harbin", name: "하얼빈", category: "수입맥주", origin: "중국", description: "중국 대표 라거 브랜드 중 하나로 다양한 중식 업종에서 찾습니다.", tags: ["하얼빈", "맥주", "중국맥주"] },
  { id: "cass", name: "카스", category: "국산주류", origin: "대한민국", description: "국내 외식업에서 폭넓게 취급되는 대표 라거입니다.", tags: ["카스", "맥주", "국산맥주"] },
  { id: "terra", name: "테라", category: "국산주류", origin: "대한민국", description: "외식업 채널에서 폭넓게 판매되는 국산 라거입니다.", tags: ["테라", "맥주", "국산맥주"] },
  { id: "chamisul", name: "참이슬", category: "국산주류", origin: "대한민국", description: "국내 음식점에서 폭넓게 취급되는 대표 소주입니다.", tags: ["참이슬", "소주"] },
  { id: "cheoeum", name: "처음처럼", category: "국산주류", origin: "대한민국", description: "다양한 외식업장에서 취급되는 국산 소주입니다.", tags: ["처음처럼", "소주"] },
  { id: "saero", name: "새로", category: "국산주류", origin: "대한민국", description: "제로 슈거 콘셉트로 알려진 국산 소주입니다.", tags: ["새로", "소주"] },
  { id: "goldenblue", name: "골든블루", category: "위스키", origin: "대한민국", description: "국내 업소용 시장에서 인지도가 높은 위스키 브랜드입니다.", tags: ["골든블루", "위스키"] },
  { id: "johnniewalker", name: "조니워커", category: "위스키", origin: "스코틀랜드", description: "세계적으로 널리 알려진 블렌디드 스카치 위스키 브랜드입니다.", tags: ["조니워커", "위스키", "스카치"] },
  { id: "wuliangye", name: "우량예", category: "중국주류", origin: "중국", description: "중국을 대표하는 고급 백주 브랜드 중 하나입니다.", tags: ["우량예", "중국술", "백주"] },
  { id: "sake", name: "사케", category: "사케", origin: "일본", description: "준마이·긴죠·다이긴죠 등 다양한 스타일을 업종에 맞게 제안합니다.", tags: ["사케", "준마이", "긴죠"] },
  { id: "wine", name: "와인", category: "와인", origin: "다양", description: "레드·화이트·스파클링 등 업종과 메뉴에 맞는 와인을 제안합니다.", tags: ["와인", "레드와인", "화이트와인"] },
  { id: "draft", name: "생맥주", category: "생맥주", origin: "다양", description: "업장 환경에 맞는 생맥주 공급과 시스템 상담을 지원합니다.", tags: ["생맥주", "케그", "호프"] },
];

export const categories = ["전체", "국산주류", "중국주류", "수입맥주", "위스키", "사케", "와인", "생맥주"];
