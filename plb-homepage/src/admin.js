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
        <p>제품과 문의를 관리하는 전용 화면입니다.</p>
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
    if (!supabase) {
      status.textContent = 'Supabase 환경변수를 먼저 연결해주세요.';
      return;
    }
    const values = Object.fromEntries(new FormData(event.currentTarget));
    status.textContent = '로그인 중입니다.';
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      status.textContent = '이메일 또는 비밀번호를 확인해주세요.';
      return;
    }
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
        <div class="admin-brand"><span>PLB</span><div><b>관리자 대시보드</b><small>INQUIRY MANAGEMENT</small></div></div>
        <div><a class="home-link" href="/">홈페이지 보기</a><button id="logoutButton" class="logout">로그아웃</button></div>
      </header>
      <section class="stats">
        <article><small>전체 문의</small><strong id="totalCount">-</strong></article>
        <article><small>신규 문의</small><strong id="newCount">-</strong></article>
        <article><small>오늘 접수</small><strong id="todayCount">-</strong></article>
      </section>
      <section class="panel">
        <div class="panel-head"><div><h1>문의 관리</h1><p>최근 접수된 제품·납품 문의입니다.</p></div><button id="refreshButton">새로고침</button></div>
        <div id="inquiryList" class="inquiry-list"><p>문의 내용을 불러오고 있습니다.</p></div>
      </section>
    </main>`;

  document.querySelector('#logoutButton').addEventListener('click', async () => {
    await supabase.auth.signOut();
    renderLogin('로그아웃되었습니다.');
  });
  document.querySelector('#refreshButton').addEventListener('click', loadInquiries);
  loadInquiries();
}

async function loadInquiries() {
  const list = document.querySelector('#inquiryList');
  list.innerHTML = '<p>문의 내용을 불러오고 있습니다.</p>';
  const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
  if (error) {
    list.innerHTML = '<p class="error">문의 조회 권한 또는 데이터베이스 설정을 확인해주세요.</p>';
    return;
  }
  const today = new Date().toISOString().slice(0, 10);
  document.querySelector('#totalCount').textContent = data.length;
  document.querySelector('#newCount').textContent = data.filter((item) => item.status === 'new').length;
  document.querySelector('#todayCount').textContent = data.filter((item) => item.created_at?.slice(0, 10) === today).length;

  if (!data.length) {
    list.innerHTML = '<p>아직 접수된 문의가 없습니다.</p>';
    return;
  }
  list.innerHTML = data.map((item) => `
    <article class="inquiry-card">
      <div class="inquiry-top"><span class="badge ${item.status}">${item.status === 'new' ? '신규' : item.status}</span><time>${new Date(item.created_at).toLocaleString('ko-KR')}</time></div>
      <h2>${escapeHtml(item.subject)}</h2>
      <p class="company">${escapeHtml(item.company_name)} · ${escapeHtml(item.phone)}</p>
      <p class="message">${escapeHtml(item.message).replaceAll('\n', '<br>')}</p>
    </article>`).join('');
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

if (!supabase) renderLogin('Supabase 환경변수를 먼저 연결해주세요.');
else supabase.auth.getSession().then(({ data }) => data.session ? renderDashboard() : renderLogin());