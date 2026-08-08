import fs from 'node:fs';
import path from 'node:path';

const publicDir = path.resolve('public');
const siteUrl = (process.env.SITE_URL || 'https://psw3077.github.io/miso-bridge').replace(/\/$/, '');

const pages = [
  {
    slug: 'liquor-wholesale-company',
    title: '주류도매회사·주류업체 찾기 | 미소주류',
    h1: '주류도매회사, 납품만이 아니라 장사까지 봐야 합니다.',
    description: '서울·경기 수도권 업소용 주류 공급, 국내주류·수입주류·중국주류·생맥주 상담. 신규 거래와 주류업체 선택을 미소주류에서 상담하세요.',
    keywords: ['주류도매회사','주류회사','주류업체','주류도매업체','업소용주류','주류납품','수도권주류도매','경기주류도매','서울주류도매'],
    body: [
      ['업소용 주류 공급', '소주·맥주·위스키·와인·사케·중국주류·생맥주까지 업종에 맞는 구성을 상담합니다.'],
      ['중국주류 강점', '연태고량주·우량예·서봉주·우란산·소흥주 등 중국주류 구성을 중식·양꼬치·훠궈 업종에 맞춰 제안합니다.'],
      ['거래 전 확인', '지역, 업종, 예상 사용량, 희망 품목을 확인한 뒤 실제 거래 가능 여부와 공급 조건을 안내합니다.'],
    ],
    cta: '신규 거래 상담',
    ctaUrl: `${siteUrl}/new-partner`,
  },
  {
    slug: 'change-liquor-company',
    title: '주류회사 변경·주류업체 변경 상담 | 미소주류',
    h1: '주류회사 변경, 단가만 보지 말고 거래 조건 전체를 비교하세요.',
    description: '기존 주류회사 변경, 주류업체 변경, 납품 품목 확대와 거래조건 점검 상담. 미소주류가 업종과 지역을 확인해 신규 거래 가능 여부를 안내합니다.',
    keywords: ['주류회사변경','주류업체변경','주류도매회사변경','주류거래처변경','주류납품업체변경','주류회사추천'],
    body: [
      ['변경 상담 항목', '현재 거래 품목, 납품 일정, 필요한 브랜드, 생맥주 설비, 결제와 운영상 불편 사항을 함께 확인합니다.'],
      ['비교 포인트', '단가뿐 아니라 품목 구성, 납품 안정성, 응대 속도, 신규 제품 대응과 장기 거래 편의성을 함께 봐야 합니다.'],
      ['신규 거래 연결', '상호, 지역, 업종과 현재 거래 상황을 남기면 담당자가 확인 후 변경 가능 여부를 상담합니다.'],
    ],
    cta: '주류회사 변경 상담',
    ctaUrl: `${siteUrl}/new-partner`,
  },
  {
    slug: 'startup-funding',
    title: '창업자금·창업자금 상담 | 미소주류',
    h1: '창업자금 상담, 자금만이 아니라 실제 개업 구조까지 함께 봅니다.',
    description: '외식업·식당·주점 창업자금 상담, 예상 예산과 업종, 오픈 시기, 주류 공급까지 연결하는 미소주류 창업 상담.',
    keywords: ['창업자금','창업자금상담','외식업창업자금','식당창업자금','주점창업자금','창업대출상담','창업비용'],
    body: [
      ['예산 점검', '보증금·인테리어·주방설비·초도물품·주류·운전자금 등 실제 개업에 필요한 항목을 나눠 확인합니다.'],
      ['자금상담 방향', '자금 지원을 보장하는 서비스가 아니라 현재 조건에 맞는 상담 방향과 필요한 전문기관 연결을 돕습니다.'],
      ['주류 공급 연계', '창업 업종과 상권에 맞는 주류 구성과 신규 거래 상담까지 한 번에 연결합니다.'],
    ],
    cta: '창업·자금 상담 신청',
    ctaUrl: `${siteUrl}/startup-consulting`,
  },
  {
    slug: 'startup-consulting-guide',
    title: '외식업 창업컨설팅·식당창업 상담 | 미소주류',
    h1: '창업컨설팅, 오픈 전부터 주류와 운영을 같이 준비하세요.',
    description: '외식업창업, 식당창업, 주점창업, 업종변경, 프랜차이즈·전문업체 연결과 주류 공급을 함께 상담하는 미소주류.',
    keywords: ['창업컨설팅','외식업창업','식당창업','주점창업','음식점창업','업종변경','프랜차이즈상담','창업업체연결'],
    body: [
      ['창업 준비', '업종, 지역, 오픈 예정 시기, 예상 예산과 필요한 주류 구성을 먼저 정리합니다.'],
      ['전문업체 연결', '필요 시 인테리어, 주방설비, 세무·노무, 마케팅, 메뉴 관련 전문업체 연결 상담을 제공합니다.'],
      ['오픈 후 거래', '상담이 실제 매장 오픈과 주류 신규 거래로 자연스럽게 이어지도록 한 흐름으로 관리합니다.'],
    ],
    cta: '무료 창업상담',
    ctaUrl: `${siteUrl}/startup-consulting`,
  },
  {
    slug: 'liquor-product-search',
    title: '주류제품검색·업소용 주류 찾기 | 미소주류',
    h1: '주류 이름으로 검색하고 업소용 공급까지 바로 상담하세요.',
    description: '연태고량주, 칭따오, 카스, 테라, 참이슬, 우량예, 사케, 와인, 위스키 등 주류제품검색과 업소용 공급 상담.',
    keywords: ['주류제품검색','주류검색','술검색','업소용주류검색','주류제품찾기','주류도매검색','중국술검색'],
    body: [
      ['제품명 검색', '제품명이나 주종으로 검색해 등록된 기본 정보와 상세 페이지를 확인할 수 있습니다.'],
      ['업소용 공급 문의', '검색 결과에서 바로 신규 거래·공급·견적 상담으로 연결됩니다.'],
      ['등록되지 않은 제품', '검색에 없는 주류는 블로그 검색 또는 전화 상담으로 취급·공급 가능 여부를 확인할 수 있습니다.'],
    ],
    cta: '주류제품 검색하기',
    ctaUrl: `${siteUrl}/#liquor-search`,
  },
];

const esc = (v='') => String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');

for (const page of pages) {
  const dir = path.join(publicDir, page.slug);
  fs.mkdirSync(dir, { recursive: true });
  const canonical = `${siteUrl}/${page.slug}/`;
  const sections = page.body.map(([h,p]) => `<article><h2>${esc(h)}</h2><p>${esc(p)}</p></article>`).join('');
  const jsonLd = JSON.stringify({
    '@context':'https://schema.org',
    '@type':'Service',
    name: page.title,
    description: page.description,
    provider:{ '@type':'Organization', name:'(주)미소주류', telephone:'+82-31-336-3077' },
    areaServed:['서울','경기도','수도권'],
    url: canonical,
  }).replaceAll('<','\\u003c');
  const html = `<!doctype html>
<html lang="ko"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(page.title)}</title><meta name="description" content="${esc(page.description)}"/><meta name="keywords" content="${esc(page.keywords.join(','))}"/><meta name="robots" content="index,follow,max-image-preview:large"/><link rel="canonical" href="${canonical}"/>
<meta property="og:type" content="website"/><meta property="og:site_name" content="미소주류 MISO ONE"/><meta property="og:title" content="${esc(page.title)}"/><meta property="og:description" content="${esc(page.description)}"/><meta property="og:url" content="${canonical}"/>
<script type="application/ld+json">${jsonLd}</script>
<style>:root{font-family:Pretendard,"Noto Sans KR",Arial,sans-serif;color:#172436;background:#f6f7f5}*{box-sizing:border-box}body{margin:0}a{text-decoration:none;color:inherit}.top{padding:18px 5%;background:#102a43;color:white;display:flex;justify-content:space-between}.wrap{width:min(1050px,90%);margin:60px auto}.kicker{color:#9a302b;font-weight:900;font-size:13px}h1{font-size:clamp(42px,6.5vw,74px);line-height:1.08;letter-spacing:-.055em;color:#102a43;max-width:900px;margin:18px 0} .lead{font-size:18px;line-height:1.8;color:#667985;max-width:850px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:42px 0}.grid article{padding:26px;border:1px solid #d9e0e3;border-radius:20px;background:#fff}.grid h2{font-size:21px;color:#102a43}.grid p{color:#667985;line-height:1.75}.cta{display:flex;gap:10px;flex-wrap:wrap}.cta a{padding:15px 19px;border-radius:12px;font-weight:900}.primary{background:#9a302b;color:#fff}.secondary{background:#102a43;color:#fff}.chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:30px}.chips span{padding:8px 11px;border-radius:999px;background:#fff;border:1px solid #d9e0e3;font-size:12px;color:#52636f}@media(max-width:760px){.grid{grid-template-columns:1fr}.wrap{margin-top:35px}.cta{display:grid}.cta a{text-align:center}}</style>
</head><body><header class="top"><a href="${siteUrl}/"><b>MISO ONE · 미소주류</b></a><a href="tel:0313363077">031-336-3077</a></header>
<main class="wrap"><span class="kicker">MISO BUSINESS GUIDE</span><h1>${esc(page.h1)}</h1><p class="lead">${esc(page.description)}</p><div class="grid">${sections}</div><div class="cta"><a class="primary" href="${page.ctaUrl}">${esc(page.cta)}</a><a class="secondary" href="tel:0313363077">전화 031-336-3077</a></div><div class="chips">${page.keywords.map(k=>`<span>#${esc(k)}</span>`).join('')}</div></main></body></html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

const extraSitemap = path.join(publicDir, 'landing-sitemap-urls.txt');
fs.writeFileSync(extraSitemap, pages.map((p) => `${siteUrl}/${p.slug}/`).join('\n') + '\n');
console.log(`Generated ${pages.length} SEO landing pages for ${siteUrl}`);
