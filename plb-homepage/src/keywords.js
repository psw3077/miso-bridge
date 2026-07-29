import './keywords.css';

const contactSection = document.querySelector('#contact');

if (contactSection && !document.querySelector('#keywords')) {
  const keywordSection = document.createElement('section');
  keywordSection.id = 'keywords';
  keywordSection.className = 'section keyword-section';
  keywordSection.setAttribute('aria-labelledby', 'keyword-title');
  keywordSection.innerHTML = `
    <p class="eyebrow dark">SEARCH KEYWORDS</p>
    <h2 id="keyword-title">PLB 주요 검색어</h2>
    <p class="keyword-copy">산업 현장에서 필요한 도료와 코팅 솔루션을 PLB에서 상담하세요.</p>
    <div class="keyword-tags" aria-label="PLB 산업용 도료 검색 키워드">
      <a href="#products">#산업용페인트</a>
      <a href="#products">#산업용도료</a>
      <a href="#products">#공업용페인트</a>
      <a href="#products">#분체도료</a>
      <a href="#products">#분체수지</a>
      <a href="#products">#방청도료</a>
      <a href="#products">#내열도료</a>
      <a href="#products">#기능성코팅</a>
      <a href="#business">#금속도장</a>
      <a href="#contact">#김해페인트</a>
      <a href="#contact">#김해산업용페인트</a>
      <a href="#contact">#경남산업용도료</a>
      <a href="#contact">#기업도료납품</a>
      <a href="#resources">#KCC</a>
      <a href="#resources">#삼화페인트</a>
      <a href="#resources">#조광페인트</a>
      <a href="#resources">#제비스코</a>
    </div>
  `;

  contactSection.before(keywordSection);
}
