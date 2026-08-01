import './keywords.css';

const contactSection = document.querySelector('#contact');

const keywordGroups = [
  {
    title: '산업용·공업용 페인트',
    description: '철재, 산업기계, 공장 설비와 금속 부품에 사용하는 도료 상담',
    links: [
      ['#산업용페인트', '/industrial-paint/'],
      ['#산업용도료', '/industrial-paint/'],
      ['#공업용페인트', '/industrial-paint/'],
      ['#공업용도료', '/industrial-paint/'],
      ['#금속용페인트', '/industrial-paint/'],
      ['#철재용페인트', '/industrial-paint/'],
      ['#기계설비도료', '/industrial-paint/'],
      ['#공장설비페인트', '/industrial-paint/']
    ]
  },
  {
    title: '분체·기능성 도료',
    description: '분체도료부터 방청, 내열, 내화학과 중방식 코팅까지 목적별 상담',
    links: [
      ['#분체도료', '/powder-coating/'],
      ['#분체수지', '/powder-coating/'],
      ['#방청도료', '/protective-coating/'],
      ['#내열도료', '/protective-coating/'],
      ['#내화학도료', '/protective-coating/'],
      ['#중방식도료', '/protective-coating/'],
      ['#기능성코팅', '/protective-coating/'],
      ['#금속도장', '/protective-coating/']
    ]
  },
  {
    title: '에폭시·우레탄·건축 도료',
    description: '바닥, 철재, 건축물과 인프라 환경에 맞는 도료 및 코팅 상담',
    links: [
      ['#에폭시페인트', '/epoxy-urethane/'],
      ['#우레탄페인트', '/epoxy-urethane/'],
      ['#바닥용에폭시', '/epoxy-urethane/'],
      ['#에폭시하도', '/epoxy-urethane/'],
      ['#우레탄상도', '/epoxy-urethane/'],
      ['#건축용페인트', '/building-infrastructure/'],
      ['#인프라도료', '/building-infrastructure/'],
      ['#철골도장', '/building-infrastructure/']
    ]
  },
  {
    title: '김해·경남 페인트 납품',
    description: '김해와 경남 지역 기업의 제품, 수량, 색상과 납기 조건 상담',
    links: [
      ['#김해페인트', '/kcc-paint/'],
      ['#김해KCC페인트', '/kcc-paint/'],
      ['#KCC페인트김해', '/kcc-paint/'],
      ['#김해산업용페인트', '/industrial-paint/'],
      ['#경남산업용도료', '/industrial-paint/'],
      ['#페인트도매', '#contact'],
      ['#도료납품', '#contact'],
      ['#기업도료납품', '#contact']
    ]
  },
  {
    title: '주요 취급 브랜드',
    description: '브랜드와 제품 재고, 규격 및 납기는 상담을 통해 확인해 주세요',
    links: [
      ['#KCC페인트', '/kcc-paint/'],
      ['#삼화페인트', '#resources'],
      ['#조광페인트', '#resources'],
      ['#제비스코', '#resources']
    ]
  }
];

if (contactSection && !document.querySelector('#keywords')) {
  const keywordSection = document.createElement('section');
  keywordSection.id = 'keywords';
  keywordSection.className = 'section keyword-section';
  keywordSection.setAttribute('aria-labelledby', 'keyword-title');
  keywordSection.innerHTML = `
    <p class="eyebrow dark">PAINT SEARCH GUIDE</p>
    <h2 id="keyword-title">페인트·도료 연관 검색 안내</h2>
    <p class="keyword-copy">필요한 제품명이나 용도를 선택하면 관련 전문안내와 PLB 상담으로 연결됩니다. 아래 표현은 주식회사 피엘비가 상담하는 도료 분야를 안내합니다.</p>
    <div class="keyword-groups">
      ${keywordGroups.map((group) => `
        <article class="keyword-group">
          <h3>${group.title}</h3>
          <p>${group.description}</p>
          <div class="keyword-tags">
            ${group.links.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}
          </div>
        </article>
      `).join('')}
    </div>
  `;

  contactSection.before(keywordSection);
}
