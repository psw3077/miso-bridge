import './admin.css';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
const app = document.querySelector('#adminApp');
let editingProductId = null;
let editingResourceId = null;

function withTimeout(promise, milliseconds = 12000) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error('timeout')), milliseconds);
  });
  return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timeoutId));
}

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
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const button = form.querySelector('button[type="submit"]');
    status.textContent = '로그인 중입니다.';
    button.disabled = true;
    try {
      const { error } = await withTimeout(supabase.auth.signInWithPassword(values));
      if (error) return status.textContent = '이메일 또는 비밀번호를 확인해주세요.';
      renderDashboard();
    } catch {
      status.textContent = '로그인 연결이 지연되고 있습니다. 잠시 후 다시 시도해주세요.';
    } finally {
      button.disabled = false;
    }
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
      <nav class="admin-tabs" aria-label="관리 메뉴">
        <a href="#productPanel">제품 관리</a>
        <a href="#resourcePanel">자료 관리</a>
        <a href="#inquiryPanel">문의 관리</a>
      </nav>
      <section class="stats">
        <article><small>전체 문의</small><strong id="totalCount">-</strong></article>
        <article><small>등록 제품</small><strong id="productCount">-</strong></article>
        <article><small>등록 자료</small><strong id="resourceCount">-</strong></article>
      </section>
      <section id="productPanel" class="panel product-panel">
        <div class="panel-head"><div><h1>제품 관리</h1><p>KCC·삼화·조광·제비스코 제품을 등록합니다.</p></div></div>
        <form id="productForm" class="product-form">
          <select name="manufacturer" required><option value="">제조사 선택</option><option>KCC</option><option>삼화페인트</option><option>조광페인트</option><option>제비스코</option><option>기타</option></select>
          <input name="name" required placeholder="제품명">
          <input name="category" value="산업용 페인트" placeholder="분류">
          <input name="usage" placeholder="주요 용도">
          <input name="specification" placeholder="규격 / 포장단위">
          <select name="stock_status"><option>문의</option><option>재고 있음</option><option>주문 가능</option><option>품절</option></select>
          <div class="form-actions">
            <button id="productSubmitButton" type="submit">제품 등록</button>
            <button id="cancelProductEdit" class="secondary-action" type="button" hidden>수정 취소</button>
          </div>
          <p id="productStatus" class="status"></p>
        </form>
        <div id="productList" class="product-list"><p>제품을 불러오고 있습니다.</p></div>
      </section>
      <section id="resourcePanel" class="panel resource-panel">
        <div class="panel-head"><div><h1>제조사 자료 관리</h1><p>TDS·MSDS·카탈로그 링크를 등록합니다.</p></div></div>
        <form id="resourceForm" class="resource-form">
          <select name="manufacturer" required><option value="">제조사 선택</option><option>KCC</option><option>삼화페인트</option><option>조광페인트</option><option>제비스코</option><option>기타</option></select>
          <input name="title" required placeholder="자료명">
          <select name="resource_type"><option>TDS</option><option>MSDS</option><option>카탈로그</option><option>기술자료</option><option>기타</option></select>
          <input name="file_url" type="url" required placeholder="PDF 또는 공식자료 URL">
          <input name="description" placeholder="간단한 설명">
          <div class="form-actions">
            <button id="resourceSubmitButton" type="submit">자료 등록</button>
            <button id="cancelResourceEdit" class="secondary-action" type="button" hidden>수정 취소</button>
          </div>
          <p id="resourceStatus" class="status"></p>
        </form>
        <div id="resourceList" class="resource-list"><p>자료를 불러오고 있습니다.</p></div>
      </section>
      <section id="inquiryPanel" class="panel">
        <div class="panel-head"><div><h1>문의 관리</h1><p>최근 접수된 제품·납품 문의입니다.</p></div><button id="refreshButton">새로고침</button></div>
        <p id="inquiryStatus" class="status"></p><div id="inquiryList" class="inquiry-list"><p>문의 내용을 불러오고 있습니다.</p></div>
      </section>
    </main>`;

  document.querySelector('#logoutButton').addEventListener('click', async () => { await supabase.auth.signOut(); renderLogin('로그아웃되었습니다.'); });
  document.querySelector('#refreshButton').addEventListener('click', () => { loadInquiries(); loadProducts(); loadResources(); });
  document.querySelector('#productForm').addEventListener('submit', saveProduct);
  document.querySelector('#resourceForm').addEventListener('submit', saveResource);
  document.querySelector('#cancelProductEdit').addEventListener('click', () => resetProductForm('제품 수정을 취소했습니다.'));
  document.querySelector('#cancelResourceEdit').addEventListener('click', () => resetResourceForm('자료 수정을 취소했습니다.'));
  loadInquiries();
  loadProducts();
  loadResources();
}

function resetProductForm(message = '') {
  const form = document.querySelector('#productForm');
  if (!form) return;
  editingProductId = null;
  form.reset();
  document.querySelector('#productSubmitButton').textContent = '제품 등록';
  document.querySelector('#cancelProductEdit').hidden = true;
  document.querySelector('#productStatus').textContent = message;
}

function startProductEdit(item) {
  const form = document.querySelector('#productForm');
  editingProductId = item.id;
  form.elements.manufacturer.value = item.manufacturer || '';
  form.elements.name.value = item.name || '';
  form.elements.category.value = item.category || '';
  form.elements.usage.value = item.usage || '';
  form.elements.specification.value = item.specification || '';
  form.elements.stock_status.value = item.stock_status || '문의';
  document.querySelector('#productSubmitButton').textContent = '제품 수정 저장';
  document.querySelector('#cancelProductEdit').hidden = false;
  document.querySelector('#productStatus').textContent = '내용을 수정한 뒤 ‘제품 수정 저장’을 눌러주세요.';
  document.querySelector('#productPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetResourceForm(message = '') {
  const form = document.querySelector('#resourceForm');
  if (!form) return;
  editingResourceId = null;
  form.reset();
  document.querySelector('#resourceSubmitButton').textContent = '자료 등록';
  document.querySelector('#cancelResourceEdit').hidden = true;
  document.querySelector('#resourceStatus').textContent = message;
}

function startResourceEdit(item) {
  const form = document.querySelector('#resourceForm');
  editingResourceId = item.id;
  form.elements.manufacturer.value = item.manufacturer || '';
  form.elements.title.value = item.title || '';
  form.elements.resource_type.value = item.resource_type || '카탈로그';
  form.elements.file_url.value = item.file_url || '';
  form.elements.description.value = item.description || '';
  document.querySelector('#resourceSubmitButton').textContent = '자료 수정 저장';
  document.querySelector('#cancelResourceEdit').hidden = false;
  document.querySelector('#resourceStatus').textContent = '내용을 수정한 뒤 ‘자료 수정 저장’을 눌러주세요.';
  document.querySelector('#resourcePanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function saveProduct(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector('#productStatus');
  const button = form.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(form));
  const isEditing = editingProductId !== null;
  status.textContent = isEditing ? '제품 수정 내용을 저장하고 있습니다.' : '제품을 등록하고 있습니다.';
  button.disabled = true;
  try {
    const request = isEditing
      ? supabase.from('products').update({ ...data, updated_at: new Date().toISOString() }).eq('id', editingProductId)
      : supabase.from('products').insert(data);
    const { error } = await withTimeout(request);
    if (error) return status.textContent = isEditing
      ? '수정 실패: 관리자 권한과 입력 내용을 확인해주세요.'
      : '등록 실패: 관리자 권한과 입력 내용을 확인해주세요.';
    resetProductForm(isEditing ? '제품 수정이 저장되었습니다.' : '제품이 등록되었습니다.');
    await loadProducts();
  } catch {
    status.textContent = '저장 연결이 지연되고 있습니다. 잠시 후 다시 시도해주세요.';
  } finally {
    button.disabled = false;
  }
}

async function saveResource(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector('#resourceStatus');
  const button = form.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(form));
  const isEditing = editingResourceId !== null;
  if (safeUrl(data.file_url) === '#') {
    status.textContent = '자료 주소는 http:// 또는 https://로 시작해야 합니다.';
    return;
  }
  status.textContent = isEditing ? '자료 수정 내용을 저장하고 있습니다.' : '자료를 등록하고 있습니다.';
  button.disabled = true;
  try {
    const request = isEditing
      ? supabase.from('resources').update(data).eq('id', editingResourceId)
      : supabase.from('resources').insert(data);
    const { error } = await withTimeout(request);
    if (error) return status.textContent = isEditing
      ? '수정 실패: 관리자 권한과 입력 내용을 확인해주세요.'
      : '등록 실패: 관리자 권한과 입력 내용을 확인해주세요.';
    resetResourceForm(isEditing ? '자료 수정이 저장되었습니다.' : '제조사 자료가 등록되었습니다.');
    await loadResources();
  } catch {
    status.textContent = '저장 연결이 지연되고 있습니다. 잠시 후 다시 시도해주세요.';
  } finally {
    button.disabled = false;
  }
}

async function loadProducts() {
  const list = document.querySelector('#productList');
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) { list.innerHTML = '<p class="error">제품 데이터를 불러오지 못했습니다.</p>'; return; }
  const rows = data || [];
  document.querySelector('#productCount').textContent = rows.length;
  if (!rows.length) return list.innerHTML = '<p>등록된 제품이 없습니다.</p>';
  list.innerHTML = rows.map((item) => `
    <article class="product-card ${item.is_active === false ? 'is-hidden' : ''}">
      <div><span class="maker">${escapeHtml(item.manufacturer)}</span><span class="visibility-badge">${item.is_active === false ? '홈페이지 숨김' : '홈페이지 공개'}</span><h2>${escapeHtml(item.name)}</h2><p>${escapeHtml(item.category)} · ${escapeHtml(item.usage || '용도 상담')}</p><small>${escapeHtml(item.specification || '규격 문의')} / ${escapeHtml(item.stock_status)}</small></div>
      <div class="manage-actions">
        <button type="button" class="edit-product secondary-action" data-id="${escapeHtml(item.id)}">수정</button>
        <button type="button" class="toggle-product secondary-action" data-id="${escapeHtml(item.id)}" data-active="${item.is_active !== false}">${item.is_active === false ? '공개하기' : '숨기기'}</button>
        <button type="button" class="delete-product" data-id="${escapeHtml(item.id)}">삭제</button>
      </div>
    </article>`).join('');

  document.querySelectorAll('.edit-product').forEach((button) => button.addEventListener('click', () => {
    const item = rows.find((row) => String(row.id) === button.dataset.id);
    if (item) startProductEdit(item);
  }));
  document.querySelectorAll('.toggle-product').forEach((button) => button.addEventListener('click', async () => {
    const nextActive = button.dataset.active !== 'true';
    button.disabled = true;
    const { error: updateError } = await supabase.from('products').update({ is_active: nextActive, updated_at: new Date().toISOString() }).eq('id', button.dataset.id);
    document.querySelector('#productStatus').textContent = updateError
      ? '공개 상태를 변경하지 못했습니다.'
      : nextActive ? '제품을 홈페이지에 공개했습니다.' : '제품을 홈페이지에서 숨겼습니다.';
    await loadProducts();
  }));
  document.querySelectorAll('.delete-product').forEach((button) => button.addEventListener('click', async () => {
    if (!confirm('이 제품을 삭제하시겠습니까?')) return;
    await supabase.from('products').delete().eq('id', button.dataset.id);
    if (String(editingProductId) === button.dataset.id) resetProductForm();
    loadProducts();
  }));
}

async function loadResources() {
  const list = document.querySelector('#resourceList');
  const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
  if (error) { list.innerHTML = '<p class="error">자료 데이터를 불러오지 못했습니다.</p>'; return; }
  const rows = data || [];
  document.querySelector('#resourceCount').textContent = rows.length;
  if (!rows.length) return list.innerHTML = '<p>등록된 제조사 자료가 없습니다.</p>';
  list.innerHTML = rows.map((item) => `
    <article class="resource-card">
      <div><span class="maker">${escapeHtml(item.manufacturer)}</span><span class="resource-type">${escapeHtml(item.resource_type)}</span><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.description || '설명 없음')}</p><a href="${safeUrl(item.file_url)}" target="_blank" rel="noopener">자료 열기 →</a></div>
      <div class="manage-actions">
        <button type="button" class="edit-resource secondary-action" data-id="${escapeHtml(item.id)}">수정</button>
        <button type="button" class="delete-resource" data-id="${escapeHtml(item.id)}">삭제</button>
      </div>
    </article>`).join('');

  document.querySelectorAll('.edit-resource').forEach((button) => button.addEventListener('click', () => {
    const item = rows.find((row) => String(row.id) === button.dataset.id);
    if (item) startResourceEdit(item);
  }));
  document.querySelectorAll('.delete-resource').forEach((button) => button.addEventListener('click', async () => {
    if (!confirm('이 자료를 삭제하시겠습니까?')) return;
    await supabase.from('resources').delete().eq('id', button.dataset.id);
    if (String(editingResourceId) === button.dataset.id) resetResourceForm();
    loadResources();
  }));
}

async function loadInquiries() {
  const list = document.querySelector('#inquiryList');
  const status = document.querySelector('#inquiryStatus');
  status.textContent = '';
  list.innerHTML = '<p>문의 내용을 불러오고 있습니다.</p>';
  let result;
  try {
    result = await withTimeout(supabase.from('inquiries').select('*').order('created_at', { ascending: false }));
  } catch {
    return list.innerHTML = '<p class="error">문의 조회 연결이 지연되고 있습니다. 잠시 후 새로고침해주세요.</p>';
  }
  const { data, error } = result;
  if (error) return list.innerHTML = '<p class="error">문의 조회 권한 또는 데이터베이스 설정을 확인해주세요.</p>';
  document.querySelector('#totalCount').textContent = data.length;
  if (!data.length) return list.innerHTML = '<p>아직 접수된 문의가 없습니다.</p>';
  const statusLabels = { new: '신규', contacted: '상담중', completed: '처리완료' };
  list.innerHTML = data.map((item) => `
    <article class="inquiry-card">
      <div class="inquiry-top"><span class="badge ${escapeHtml(item.status)}">${statusLabels[item.status] || escapeHtml(item.status)}</span><time>${new Date(item.created_at).toLocaleString('ko-KR')}</time></div>
      <h2>${escapeHtml(item.subject)}</h2><p class="company">${escapeHtml(item.company_name)} · ${escapeHtml(item.phone)}</p>
      <p class="message">${escapeHtml(item.message).replaceAll('\\n', '<br>')}</p>
      <div class="inquiry-actions">
        <a href="tel:${escapeHtml(item.phone)}">전화하기</a>
        <button type="button" class="inquiry-status" data-id="${item.id}" data-status="new" ${item.status === 'new' ? 'disabled' : ''}>신규</button>
        <button type="button" class="inquiry-status" data-id="${item.id}" data-status="contacted" ${item.status === 'contacted' ? 'disabled' : ''}>상담중</button>
        <button type="button" class="inquiry-status complete" data-id="${item.id}" data-status="completed" ${item.status === 'completed' ? 'disabled' : ''}>처리완료</button>
      </div>
    </article>`).join('');
  document.querySelectorAll('.inquiry-status').forEach((button) => button.addEventListener('click', async () => {
    status.textContent = '문의 상태를 변경하고 있습니다.';
    button.disabled = true;
    try {
      const { error: updateError } = await withTimeout(
        supabase.from('inquiries').update({ status: button.dataset.status }).eq('id', button.dataset.id)
      );
      if (updateError) return status.textContent = '상태 변경 권한을 확인해주세요.';
      status.textContent = '문의 상태가 변경되었습니다.';
      await loadInquiries();
    } catch {
      status.textContent = '상태 변경 연결이 지연되고 있습니다.';
    } finally {
      button.disabled = false;
    }
  }));
}

function escapeHtml(value = '') { return String(value).replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])); }
function safeUrl(value = '') {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? escapeHtml(url.href) : '#';
  } catch {
    return '#';
  }
}

if (!supabase) renderLogin('Supabase 환경변수를 먼저 연결해주세요.');
else supabase.auth.getSession().then(({ data }) => data.session ? renderDashboard() : renderLogin());
