import './styles.css';
import './channels.css';
const app = document.querySelector('#app');

const sampleProducts = [
  { manufacturer: 'KCC', name: '산업용 방청 프라이머', category: '방청도료', usage: '철재·기계·설비 하도', specification: '현장 상담 후 결정', stock_status: '상담 가능' },
  { manufacturer: '삼화페인트', name: '내열 코팅 시스템', category: '내열도료', usage: '고온 설비·배관', specification: '사용 온도별 상담', stock_status: '주문 상담' },
  { manufacturer: '조광페인트', name: '분체도료', category: '분체도료', usage: '금속 제품 표면 마감', specification: '색상·광택별 상담', stock_status: '상담 가능' },
  { manufacturer: '제비스코', name: '내화학 코팅', category: '기능성도료', usage: '공장·화학 환경 보호', specification: '환경 조건별 상담', stock_status: '주문 상담' }
];

const sampleResources = [
  { manufacturer: 'KCC', title: 'KCC 산업용 도료 공식자료', resource_type: '공식 홈페이지', file_url: 'https://www.kccworld.co.kr/', description: 'KCC 제품 및 기술자료 확인' },
  { manufacturer: '삼화페인트', title: '삼화페인트 산업용 자료', resource_type: '공식 홈페이지', file_url: 'https://samhwa.com/', description: '삼화페인트 제품 및 자료 확인' },
  { manufacturer: '조광페인트', title: '조광페인트 기술자료', resource_type: '공식 홈페이지', file_url: 'https://www.ckpc.co.kr/', description: '조광페인트 제품 및 기술자료 확인' },
  { manufacturer: '제비스코', title: '제비스코 제품자료', resource_type: '공식 홈페이지', file_url: 'https://www.jevisco.com/', description: '제비스코 제품 및 자료 확인' }
];

app.innerHTML = `
<header class="site-header">
  <a class="brand" href="#home"><span>PLB</span><b>주식회사 피엘비<small>INDUSTRIAL COATING PARTNER</small></b></a>
  <nav><a href="#about">회사소개</a><a href="#business">사업분야</a><a href="#solutions">전문안내</a><a href="#products">제품소개</a><a href="#finder">도료찾기</a><a href="#resources">자료실</a><a href="#channels">소식</a><a href="#contact">문의하기</a></nav>
</header>
<main>
  <section id="home" class="hero">
    <img class="hero-image" src="/plb-warehouse-main.jpg" alt="PLB 산업용 도료 창고" onerror="this.style.display='none'">
    <div class="hero-overlay"></div>
    <div class="hero-copy"><p class="eyebrow">INDUSTRIAL COATING PARTNER</p><h1>산업용 도료의 모든 솔루션,<br>PLB가 함께합니다.</h1><p>산업용 페인트, 분체도료, 기능성 코팅부터 기업 납품까지 현장에 맞는 제품을 연결합니다.</p><div class="actions"><a class="primary" href="tel:0553136778">전화 상담 055-313-6778</a><a class="secondary" href="#contact">1분 견적 문의</a></div><div class="hero-points"><span>산업용 도료</span><span>안정적인 재고</span><span>신속한 출고</span><span>기업 맞춤 상담</span></div></div>
  </section>
  <section id="about" class="section two-column"><figure class="photo-card"><img src="/plb-ceo.jpg" alt="주식회사 피엘비 박상민 대표" onerror="this.style.display='none'"></figure><div><p class="eyebrow dark">CEO MESSAGE</p><h2>제품을 파는 회사를 넘어<br>현장을 이해하는 파트너</h2><blockquote>“고객의 작업 환경과 목적에 맞는 도료를 제안하는 것이 PLB의 경쟁력입니다.”</blockquote><p>주식회사 피엘비는 제품 선택부터 납품까지 신뢰할 수 있는 상담과 공급을 제공합니다.</p><div class="trust-list"><span>✓ 산업용 도료 전문</span><span>✓ 기업 맞춤 상담</span><span>✓ 제조사 공식자료</span><span>✓ 빠른 출고 대응</span></div></div></section>
  <section id="business" class="section dark-section"><p class="eyebrow">BUSINESS AREA</p><h2>PLB 사업분야</h2><div class="image-cards"><article><img src="/plb-warehouse-sub.jpg" alt="산업용 페인트" onerror="this.style.display='none'"><div><b>01</b><h3>산업용 페인트</h3><p>철재, 기계, 설비, 공장 시설용 도료</p></div></article><article><img src="/plb-warehouse-main.jpg" alt="분체도료" onerror="this.style.display='none'"><div><b>02</b><h3>분체도료·분체수지</h3><p>공정과 사용 환경에 맞는 분체도료</p></div></article><article><img src="/plb-warehouse-sub.jpg" alt="기능성 코팅" onerror="this.style.display='none'"><div><b>03</b><h3>기능성 코팅</h3><p>방청, 내열, 내화학 등 목적별 코팅</p></div></article><article><img src="/plb-warehouse-main.jpg" alt="기업 납품" onerror="this.style.display='none'"><div><b>04</b><h3>기업 납품</h3><p>재고와 출고를 기반으로 한 신속한 대응</p></div></article></div></section>
  <section id="solutions" class="section seo-services">
    <p class="eyebrow dark">PLB COATING GUIDE</p>
    <h2>산업 현장별 도료 전문안내</h2>
    <p class="section-copy">소재, 사용 환경과 필요한 기능에 맞는 도료 정보를 확인하고 PLB에 바로 상담할 수 있습니다.</p>
    <div class="seo-service-grid">
      <a href="/industrial-paint.html"><span>INDUSTRIAL PAINT</span><h3>김해 산업용 페인트</h3><p>철재·산업기계·공장 설비에 사용하는 공업용 페인트와 기업 납품 안내</p><b>자세히 보기 →</b></a>
      <a href="/powder-coating.html"><span>POWDER COATING</span><h3>분체도료·분체수지</h3><p>금속 제품의 내구성과 외관을 위한 분체도료 선택 및 납품 안내</p><b>자세히 보기 →</b></a>
      <a href="/protective-coating.html"><span>PROTECTIVE COATING</span><h3>방청·내열·기능성 코팅</h3><p>부식, 고온, 화학 환경에 대응하는 기능성 도료 상담 안내</p><b>자세히 보기 →</b></a>
    </div>
  </section>
  <section id="stock" class="section two-column stock-section"><figure class="warehouse-photo"><img src="/plb-warehouse-sub.jpg" alt="PLB 창고 내부" onerror="this.style.display='none'"></figure><div><p class="eyebrow dark">STOCK & DELIVERY</p><h2>안정적인 재고,<br>신속한 납품</h2><p>다양한 산업용 도료를 체계적으로 보관하고 고객의 생산 일정에 맞춰 안정적으로 공급합니다.</p><ol class="process"><li><b>01</b><span>문의 접수와 사용 환경 확인</span></li><li><b>02</b><span>제품 및 제조사 상담</span></li><li><b>03</b><span>견적·재고·납기 확인</span></li><li><b>04</b><span>출고 및 기업 납품</span></li></ol></div></section>
  <section id="products" class="section products-section"><p class="eyebrow dark">PRODUCT CATALOG</p><h2>제품소개</h2><div class="product-tools"><input id="productSearch" type="search" placeholder="제품명·용도·제조사 검색"><select id="makerFilter"><option value="">전체 제조사</option><option>KCC</option><option>삼화페인트</option><option>조광페인트</option><option>제비스코</option></select></div><div id="productGrid" class="product-grid"><p>제품 정보를 불러오고 있습니다.</p></div></section>
  <section id="finder" class="section"><p class="eyebrow dark">PAINT FINDER</p><h2>용도에 맞는 도료 찾기</h2><div class="finder-grid"><div class="finder-form"><label>사용 소재<select id="material"><option>철재</option><option>알루미늄</option><option>스테인리스</option><option>플라스틱</option></select></label><label>필요 기능<select id="function"><option>방청</option><option>내열</option><option>내화학</option><option>외관 마감</option></select></label><label>사용 환경<select id="environment"><option>실내</option><option>실외</option><option>고온</option><option>습기·부식</option></select></label><button id="applyFinder" class="primary button">상담 문구 만들기</button></div><div class="finder-result"><small>PLB 상담 준비 결과</small><h3 id="finderTitle">철재용 방청 도료 상담</h3><p id="finderDescription">철재 · 방청 · 실내 조건으로 제품 및 제조사 상담을 준비합니다.</p></div></div></section>
  <section id="resources" class="section resource-section"><p class="eyebrow dark">TECHNICAL LIBRARY</p><h2>제조사 기술자료실</h2><p class="section-copy">TDS, MSDS, 카탈로그와 제조사 공식자료를 한곳에서 확인할 수 있습니다.</p><div class="resource-tools"><select id="resourceMakerFilter"><option value="">전체 제조사</option><option>KCC</option><option>삼화페인트</option><option>조광페인트</option><option>제비스코</option></select><select id="resourceTypeFilter"><option value="">전체 자료</option><option>TDS</option><option>MSDS</option><option>카탈로그</option><option>공식 홈페이지</option></select></div><div id="resourceGrid" class="resource-grid"><p>자료를 불러오고 있습니다.</p></div></section>
  <section class="section two-column sponsor-section"><figure class="sponsor-photo"><img src="/plb-sponsor.jpg" alt="PLB 드라마 협찬" onerror="this.style.display='none'"></figure><div><p class="eyebrow dark">DRAMA SPONSORSHIP</p><h2>콘텐츠 속에서도 만나는 PLB</h2><p>드라마 협찬을 통해 산업용 도료 전문기업의 브랜드와 신뢰를 더 넓게 알리고 있습니다.</p><a class="primary" href="https://blog.naver.com/plb6498" target="_blank" rel="noopener">협찬 소식 보기</a></div></section>
  <section id="channels" class="section channels-section"><p class="eyebrow dark">PLB CHANNELS</p><h2>PLB 소식과 상담 채널</h2><div class="channel-grid"><a href="https://blog.naver.com/plb6498" target="_blank" rel="noopener"><strong>네이버 블로그</strong><span>제품·현장 소식 보기 →</span></a><a href="#contact"><strong>네이버 클립</strong><span>영상 채널 준비 중</span></a><a href="#contact"><strong>카카오채널</strong><span>상담 채널 연결 준비 중</span></a><a href="#contact"><strong>유튜브</strong><span>공식 영상 채널 준비 중</span></a></div></section>
  <section id="contact" class="section contact-section"><div><p class="eyebrow">CONTACT PLB</p><h2>제품·납품 상담</h2><p>대표전화 055-313-6778<br>휴대전화 010-2851-6774<br>이메일 plb6498@naver.com<br>경상남도 김해시 호계로300번길 115-22, 가동(삼정동)</p></div><form id="inquiryForm"><input name="company_name" required placeholder="회사명 / 담당자"><input name="phone" required placeholder="연락처"><input name="subject" id="subject" required placeholder="문의 제품 또는 용도"><textarea name="message" id="message" required placeholder="문의 내용을 입력해주세요."></textarea><button class="primary button" type="submit">문의 접수</button><p id="formStatus" role="status"></p></form></section>
</main>
<div class="floating-contact"><a href="tel:0553136778">전화</a><a href="#finder">도료찾기</a><a href="#contact">견적문의</a></div>
<footer>주식회사 피엘비 · 대표 박상민 · TEL 055-313-6778 · FAX 055-313-6779 · EMAIL plb6498@naver.com</footer>`;

let products = sampleProducts;
let resources = sampleResources;
const productGrid = document.querySelector('#productGrid');
const productSearch = document.querySelector('#productSearch');
const makerFilter = document.querySelector('#makerFilter');
const resourceGrid = document.querySelector('#resourceGrid');
const resourceMakerFilter = document.querySelector('#resourceMakerFilter');
const resourceTypeFilter = document.querySelector('#resourceTypeFilter');

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
}

function safeUrl(value = '') {
  try {
    const url = new URL(value, window.location.origin);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '#';
  } catch {
    return '#';
  }
}

function renderProducts() {
  const query = productSearch.value.trim().toLowerCase();
  const maker = makerFilter.value;
  const filtered = products.filter((p) => (!maker || p.manufacturer === maker) && [p.manufacturer, p.name, p.category, p.usage, p.specification].join(' ').toLowerCase().includes(query));
  productGrid.innerHTML = filtered.length ? filtered.map((p) => `<article class="product-card"><div class="product-maker">${escapeHtml(p.manufacturer)}</div><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.usage || '용도 상담')}</p><dl><div><dt>분류</dt><dd>${escapeHtml(p.category || '-')}</dd></div><div><dt>규격</dt><dd>${escapeHtml(p.specification || '-')}</dd></div><div><dt>재고</dt><dd>${escapeHtml(p.stock_status || '상담')}</dd></div></dl><button class="product-inquiry" data-product="${escapeHtml(p.name)}">이 제품 문의</button></article>`).join('') : '<p class="empty-products">검색 결과가 없습니다. 전화 또는 견적 문의를 이용해주세요.</p>';
  document.querySelectorAll('.product-inquiry').forEach((button) => button.addEventListener('click', () => {
    document.querySelector('#subject').value = `${button.dataset.product} 문의`;
    document.querySelector('#message').value = `${button.dataset.product}의 용도, 규격, 재고 및 견적 상담을 요청합니다.`;
    document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
  }));
}

function renderResources() {
  const maker = resourceMakerFilter.value;
  const type = resourceTypeFilter.value;
  const filtered = resources.filter((item) => (!maker || item.manufacturer === maker) && (!type || item.resource_type === type));
  resourceGrid.innerHTML = filtered.length ? filtered.map((item) => `<article class="resource-card"><div class="resource-top"><span>${escapeHtml(item.manufacturer)}</span><b>${escapeHtml(item.resource_type)}</b></div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description || '제조사 기술자료')}</p><a href="${safeUrl(item.file_url)}" target="_blank" rel="noopener">자료 열기 →</a></article>`).join('') : '<p class="empty-products">등록된 자료가 없습니다.</p>';
}

async function fetchCatalog(path) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(path, { signal: controller.signal });
    if (!response.ok) throw new Error('catalog request failed');
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function loadProducts() {
  try {
    const data = await fetchCatalog('/api/products');
    if (data.length) products = data;
  } catch {
    // Keep the reliable sample catalog visible when the live catalog is unavailable.
  }
  renderProducts();
}

async function loadResources() {
  try {
    const data = await fetchCatalog('/api/resources');
    if (data.length) resources = data;
  } catch {
    // Keep the official manufacturer links visible when the live library is unavailable.
  }
  renderResources();
}

productSearch.addEventListener('input', renderProducts);
makerFilter.addEventListener('change', renderProducts);
resourceMakerFilter.addEventListener('change', renderResources);
resourceTypeFilter.addEventListener('change', renderResources);
loadProducts();
loadResources();

const material = document.querySelector('#material');
const fn = document.querySelector('#function');
const environment = document.querySelector('#environment');
function updateFinder() {
  document.querySelector('#finderTitle').textContent = `${material.value}용 ${fn.value} 도료 상담`;
  document.querySelector('#finderDescription').textContent = `${material.value} · ${fn.value} · ${environment.value} 조건으로 제품 및 제조사 상담을 준비합니다.`;
  document.querySelector('#subject').value = `${material.value}용 ${fn.value} 도료`;
  document.querySelector('#message').value = `사용 소재: ${material.value}\n필요 기능: ${fn.value}\n사용 환경: ${environment.value}\n\n추천 제품 및 견적 상담을 요청합니다.`;
  document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
}
document.querySelector('#applyFinder').addEventListener('click', updateFinder);

document.querySelector('#inquiryForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector('#formStatus');
  const data = Object.fromEntries(new FormData(form));
  status.textContent = '문의 내용을 저장하고 있습니다.';
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 12000);
  let response;
  try {
    response = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal
    });
  } catch (error) {
    const isTimeout = error.name === 'AbortError';
    status.textContent = isTimeout
      ? '저장 연결이 지연되고 있습니다. 잠시 후 다시 시도하거나 055-313-6778로 연락해주세요.'
      : `문의 저장 실패: ${error.message}`;
    return;
  } finally {
    window.clearTimeout(timeoutId);
  }
  if (!response.ok) {
    let message = '문의 저장에 실패했습니다.';
    try {
      const result = await response.json();
      if (result.message) message = result.message;
    } catch {
      // Keep the friendly fallback message.
    }
    status.textContent = `문의 저장 실패: ${message}`;
    return;
  }
  form.reset();
  status.textContent = '문의가 정상적으로 접수되었습니다.';
});
