import './admin.css';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
const app = document.querySelector('#adminApp');

function renderLogin(message = '') {
  app.innerHTML = `
    <main class="admin-shell login-shell">
      <section class="login-card">
        <a class="back" href="/">← PLB 홈페이지</a>
        <div class="admin-brand"><span>PLB</span><div><b>관리자 로그인</b><small>ADMIN CONSOLE</small></div></div>
        <p>제품과 문의, 제조사 자료를 관리하는 전용 화면입니다.</p>
        <form id="loginForm">
          <label>관리자 이메일<input type="email" name="email" required autocomplete="username"></label>
          <label>비밀번호<input type="password" name="password" required autocomplete="current-password"></label>
          <button type="submit">로그인</button>
          <p class="status" id="loginStatus">${message}</p>
        </form>
      </section>
    </main>`;

  document.querySelector('#loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.querySelector('#loginStatus');
    if (!supabase) return status.textContent = 'Supabase 환경변수를 먼저 연결해주세요.';
    const values = Object.fromEntries(new FormData(event.currentTarget));
    status.textContent = '로그인 중입니다.';
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) return status.textContent = '이메일 또는 비밀번호를 확인해주세요.';
    renderDashboard();
  });
}

async function renderDashboard() {
  if (!supabase) return renderLogin('Supabase 환경변수를 먼저 연결해주세요.');
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return renderLogin();

  app.innerHTML = `
    <main class="admin-shell">
      <header class="admin-header">
        <div class="admin-brand"><span>PLB</span><div><b>관리자 대시보드</b><small>PRODUCT · RESOURCE · INQUIRY</small></div></div>
        <div><a class="home-link" href="/">홈페이지 보기</a><button id="logoutButton" class="logout">로그아웃</button></div>
      </header>
      <section class="stats">
        <article><small>전체 문의</small><strong id="totalCount">-</strong></article>
        <article><small>등록 제품</small><strong id="productCount">-</strong></article>
        <article><small>등록 자료</small><strong id="resourceCount">-</strong></article>
      </section>
      <section class="panel product-panel">
        <div class="panel-head"><div><h1>제품 관리</h1><p>KCC·삼화·조광·제비스코 제품을 등록합니다.</p></div></div>
        <form id="productForm" class="product-form">
          <select name="manufacturer" required><option value="">제조사 선택</option><option>KCC</option><option>삼화페인트</option><option>조광페인트</option><option>제비스코</option><option>기타</option></select>
          <input name="name" required placeholder="제품명">
          <input name="category" value="산업용 페인트" placeholder="분류">
          <input name="usage" placeholder="주요 용도">
          <input name="specification" placeholder="규격 / 포장단위">
          <select name="stock_status"><option>문의</option><option>재고 있음</option><option>주문 가능</option><option>품절</option></select>
          <button type="submit">제품 등록</button>
          <p id="productStatus" class="status"></p>
        </form>
        <div id="productList" class="product-list"><p>제품을 불러오고 있습니다.</p></div>
      </section>
      <section class="panel resource-panel">
        <div class="panel-head"><div><h1>제조사 자료 관리</h1><p>TDS·MSDS·카탈로그 링크를 등록합니다.</p></div></div>
        <form id="resourceForm" class="resource-form">
          <select name="manufacturer" required><option value="">제조사 선택</option><option>KCC</option><option>삼화페인트</option><option>조광페인트</option><option>제비스코</option><option>기타</option></select>
          <input name="title" required placeholder="자료명">
          <select name="resource_type"><option>TDS</option><option>MSDS</option><option>카탈로그</option><option>기술자료</option><option>기타</option></select>
          <input name="file_url" type="url" required placeholder="PDF 또는 공식자료 URL">
          <input name="description" placeholder="간단한 설명">
          <button type="submit">자료 등록</button>
          <p id="resourceStatus" class="status"></p>
        </form>
        <div id="resourceList" class="resource-list"><p>자료를 불러오고 있습니다.</p></div>
      </section>
      <section class="panel">
        <div class="panel-head"><div><h1>문의 관리</h1><p>최근 접수된 제품·납품 문의입니다.</p></div><button id="refreshButton">새로고침</button></div>
        <div id="inquiryList" class="inquiry-list"><p>문의 내용을 불러오고 있습니다.</p></div>
      </section>
    </main>`;

  document.querySelector('#logoutButton').addEventListener('click', async () => { await supabase.auth.signOut(); renderLogin('로그아웃되었습니다.'); });
  document.querySelector('#refreshButton').addEventListener('click', () => { loadInquiries(); loadProducts(); loadResources(); });
  document.querySelector('#productForm').addEventListener('submit', saveProduct);
  document.querySelector('#resourceForm').addEventListener('submit', saveResource);
  loadInquiries();
  loadProducts();
  loadResources();
}

async function saveProduct(event) {
  event.preventDefault();
  const status = document.querySelector('#productStatus');
  const data = Object.fromEntries(new FormData(event.currentTarget));
  status.textContent = '제품을 등록하고 있습니다.';
  const { error } = await supabase.from('products').insert(data);
  if (error) return status.textContent = '등록 실패: 제품 테이블과 권한 설정을 확인해주세요.';
  event.currentTarget.reset();
  status.textContent = '제품이 등록되었습니다.';
  loadProducts();
}

async function saveResource(event) {
  event.preventDefault();
  const status = document.querySelector('#resourceStatus');
  const data = Object.fromEntries(new FormData(event.currentTarget));
  status.textContent = '자료를 등록하고 있습니다.';
  const { error } = await supabase.from('resources').insert(data);
  if (error) return status.textContent = '등록 실패: 자료 테이블과 권한 설정을 확인해주세요.';
  event.currentTarget.reset();
  status.textContent = '제조사 자료가 등록되었습니다.';
  loadResources();
}

async function loadProducts() {
  const list = document.querySelector('#productList');
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) { list.innerHTML = '<p class="error">제품 데이터를 불러오지 못했습니다.</p>'; return; }
  document.querySelector('#productCount').textContent = data.length;
  if (!data.length) return list.innerHTML = '<p>등록된 제품이 없습니다.</p>';
  list.innerHTML = data.map((item) => `
    <article class="product-card">
      <div><span class="maker">${escapeHtml(item.manufacturer)}</span><h2>${escapeHtml(item.name)}</h2><p>${escapeHtml(item.category)} · ${escapeHtml(item.usage || '용도 상담')}</p><small>${escapeHtml(item.specification || '규격 문의')} / ${escapeHtml(item.stock_status)}</small></div>
      <button class="delete-product" data-id="${item.id}">삭제</button>
    </article>`).join('');
  document.querySelectorAll('.delete-product').forEach((button) => button.addEventListener('click', async () => {
    if (!confirm('이 제품을 삭제하시겠습니까?')) return;
    await supabase.from('products').delete().eq('id', button.dataset.id);
    loadProducts();
  }));
}

async function loadResources() {
  const list = document.querySelector('#resourceList');
  const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
  if (error) { list.innerHTML = '<p class="error">자료 데이터를 불러오지 못했습니다.</p>'; return; }
  document.querySelector('#resourceCount').textContent = data.length;
  if (!data.length) return list.innerHTML = '<p>등록된 제조사 자료가 없습니다.</p>';
  list.innerHTML = data.map((item) => `
    <article class="resource-card">
      <div><span class="maker">${escapeHtml(item.manufacturer)}</span><span class="resource-type">${escapeHtml(item.resource_type)}</span><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.description || '설명 없음')}</p><a href="${escapeAttribute(item.file_url)}" target="_blank" rel="noopener">자료 열기 →</a></div>
      <button class="delete-resource" data-id="${item.id}">삭제</button>
    </article>`).join('');
  document.querySelectorAll('.delete-resource').forEach((button) => button.addEventListener('click', async () => {
    if (!confirm('이 자료를 삭제하시겠습니까?')) return;
    await supabase.from('resources').delete().eq('id', button.dataset.id);
    loadResources();
  }));
}

async function loadInquiries() {
  const list = document.querySelector('#inquiryList');
  list.innerHTML = '<p>문의 내용을 불러오고 있습니다.</p>';
  const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
  if (error) return list.innerHTML = '<p class="error">문의 조회 권한 또는 데이터베이스 설정을 확인해주세요.</p>';
  document.querySelector('#totalCount').textContent = data.length;
  if (!data.length) return list.innerHTML = '<p>아직 접수된 문의가 없습니다.</p>';
  list.innerHTML = data.map((item) => `
    <article class="inquiry-card">
      <div class="inquiry-top"><span class="badge ${item.status}">${item.status === 'new' ? '신규' : item.status}</span><time>${new Date(item.created_at).toLocaleString('ko-KR')}</time></div>
      <h2>${escapeHtml(item.subject)}</h2><p class="company">${escapeHtml(item.company_name)} · ${escapeHtml(item.phone)}</p>
      <p class="message">${escapeHtml(item.message).replaceAll('\n', '<br>')}</p>
    </article>`).join('');
}

function escapeHtml(value = '') { return String(value).replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])); }
function escapeAttribute(value = '') { return escapeHtml(value); }

if (!supabase) renderLogin('Supabase 환경변수를 먼저 연결해주세요.');
else supabase.auth.getSession().then(({ data }) => data.session ? renderDashboard() : renderLogin());
