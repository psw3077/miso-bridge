import './styles.css';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const app = document.querySelector('#app');

app.innerHTML = `
<header class="site-header">
  <a class="brand" href="#home"><span>PLB</span><b>주식회사 피엘비</b></a>
  <nav><a href="#about">회사소개</a><a href="#business">사업분야</a><a href="#finder">도료찾기</a><a href="#contact">문의하기</a></nav>
</header>
<main>
  <section id="home" class="hero">
    <div class="hero-overlay"></div>
    <div class="hero-copy">
      <p class="eyebrow">INDUSTRIAL COATING PARTNER</p>
      <h1>산업의 완성도를 높이는<br>도료 전문 파트너</h1>
      <p>산업용 페인트, 분체도료, 기능성 코팅부터 기업 납품까지 현장에 맞는 제품을 연결합니다.</p>
      <div class="actions"><a class="primary" href="tel:0553136778">전화 상담</a><a class="secondary" href="#contact">견적 문의</a></div>
    </div>
  </section>
  <section id="about" class="section two-column">
    <div class="photo-card ceo-photo" aria-label="박상민 대표 사진 영역"></div>
    <div><p class="eyebrow dark">CEO MESSAGE</p><h2>제품을 파는 회사를 넘어<br>현장을 이해하는 파트너</h2><blockquote>“고객의 작업 환경과 목적에 맞는 도료를 제안하는 것이 PLB의 경쟁력입니다.”</blockquote><p>주식회사 피엘비는 산업 현장의 다양한 요구에 대응하며 제품 선택부터 납품까지 신뢰할 수 있는 상담과 공급을 제공합니다.</p></div>
  </section>
  <section id="business" class="section dark-section">
    <p class="eyebrow">BUSINESS AREA</p><h2>PLB 사업분야</h2>
    <div class="cards">
      <article><b>01</b><h3>산업용 페인트</h3><p>철재, 기계, 설비, 공장 시설용 도료</p></article>
      <article><b>02</b><h3>분체도료·분체수지</h3><p>공정과 사용 환경에 맞는 분체도료</p></article>
      <article><b>03</b><h3>기능성 코팅</h3><p>방청, 내열, 내화학 등 목적별 코팅</p></article>
      <article><b>04</b><h3>기업 납품</h3><p>재고와 출고를 기반으로 한 신속한 대응</p></article>
    </div>
  </section>
  <section id="finder" class="section">
    <p class="eyebrow dark">PAINT FINDER</p><h2>용도에 맞는 도료 찾기</h2>
    <div class="finder-grid">
      <div class="finder-form">
        <label>사용 소재<select id="material"><option>철재</option><option>알루미늄</option><option>스테인리스</option><option>플라스틱</option></select></label>
        <label>필요 기능<select id="function"><option>방청</option><option>내열</option><option>내화학</option><option>외관 마감</option></select></label>
        <label>사용 환경<select id="environment"><option>실내</option><option>실외</option><option>고온</option><option>습기·부식</option></select></label>
        <button id="applyFinder" class="primary button">상담 문구 만들기</button>
      </div>
      <div class="finder-result"><small>PLB 상담 준비 결과</small><h3 id="finderTitle">철재용 방청 도료 상담</h3><p id="finderDescription">철재 · 방청 · 실내 조건으로 제품 및 제조사 상담을 준비합니다.</p></div>
    </div>
  </section>
  <section id="contact" class="section contact-section">
    <div><p class="eyebrow">CONTACT PLB</p><h2>제품·납품 상담</h2><p>대표전화 055-313-6778<br>휴대전화 010-2851-6774<br>이메일 plb6498@naver.com</p></div>
    <form id="inquiryForm">
      <input name="company_name" required placeholder="회사명 / 담당자">
      <input name="phone" required placeholder="연락처">
      <input name="subject" id="subject" required placeholder="문의 제품 또는 용도">
      <textarea name="message" id="message" required placeholder="문의 내용을 입력해주세요."></textarea>
      <button class="primary button" type="submit">문의 접수</button>
      <p id="formStatus" role="status"></p>
    </form>
  </section>
</main>
<footer>주식회사 피엘비 · 대표 박상민 · 경상남도 김해시 호계로300번길 115-22, 가동(삼정동)</footer>`;

const material = document.querySelector('#material');
const fn = document.querySelector('#function');
const environment = document.querySelector('#environment');
const finderTitle = document.querySelector('#finderTitle');
const finderDescription = document.querySelector('#finderDescription');

function updateFinder() {
  finderTitle.textContent = `${material.value}용 ${fn.value} 도료 상담`;
  finderDescription.textContent = `${material.value} · ${fn.value} · ${environment.value} 조건으로 제품 및 제조사 상담을 준비합니다.`;
  document.querySelector('#subject').value = `${material.value}용 ${fn.value} 도료`;
  document.querySelector('#message').value = `사용 소재: ${material.value}\n필요 기능: ${fn.value}\n사용 환경: ${environment.value}\n\n추천 제품 및 견적 상담을 요청합니다.`;
}

document.querySelector('#applyFinder').addEventListener('click', updateFinder);

document.querySelector('#inquiryForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const status = document.querySelector('#formStatus');
  const data = Object.fromEntries(new FormData(event.currentTarget));
  status.textContent = '문의 내용을 저장하고 있습니다.';
  if (!supabase) {
    status.textContent = 'Supabase 환경변수 연결 전입니다. 현재는 이메일 상담을 이용해주세요.';
    return;
  }
  const { error } = await supabase.from('inquiries').insert(data);
  if (error) {
    console.error(error);
    status.textContent = '문의 저장에 실패했습니다. 전화 또는 이메일로 연락해주세요.';
    return;
  }
  event.currentTarget.reset();
  status.textContent = '문의가 정상적으로 접수되었습니다.';
});
