import fs from 'node:fs';
import path from 'node:path';

const sourcePath = path.resolve('src/misoOneData.ts');
const publicDir = path.resolve('public');
const productsDir = path.join(publicDir, 'products');
const source = fs.readFileSync(sourcePath, 'utf8');
const siteUrl = (process.env.SITE_URL || 'https://psw3077.github.io/miso-bridge').replace(/\/$/, '');

const objectLines = source.split('\n').filter((line) => line.trim().startsWith('{ id:'));
const pick = (line, key) => {
  const quoted = line.match(new RegExp(`${key}: \\"([^\\"]*)\\"`));
  return quoted?.[1] || '';
};

const products = objectLines.map((line) => ({
  id: pick(line, 'id'),
  name: pick(line, 'name'),
  category: pick(line, 'category'),
  origin: pick(line, 'origin'),
  alcohol: pick(line, 'alcohol'),
  volume: pick(line, 'volume'),
  description: pick(line, 'description'),
})).filter((p) => p.id && p.name);

const esc = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

fs.rmSync(productsDir, { recursive: true, force: true });
fs.mkdirSync(productsDir, { recursive: true });

for (const product of products) {
  const dir = path.join(productsDir, product.id);
  fs.mkdirSync(dir, { recursive: true });
  const canonical = `${siteUrl}/products/${product.id}/`;
  const searchUrl = `${siteUrl}/?product=${encodeURIComponent(product.id)}#liquor-search`;
  const blogUrl = `https://blog.naver.com/saga9292/PostSearchList.naver?SearchText=${encodeURIComponent(product.name)}`;
  const imageUrl = `${siteUrl}/product-images/${product.id}.webp`;
  const title = `${product.name} 도매·업소용 공급 | 미소주류`;
  const description = `${product.name} ${product.category} 업소용 공급·견적 상담. ${product.description} 미소주류 031-336-3077.`;
  const specs = [
    product.origin && `<li><b>원산지</b><span>${esc(product.origin)}</span></li>`,
    product.alcohol && `<li><b>도수</b><span>${esc(product.alcohol)}</span></li>`,
    product.volume && `<li><b>용량</b><span>${esc(product.volume)}</span></li>`,
    product.category && `<li><b>분류</b><span>${esc(product.category)}</span></li>`,
  ].filter(Boolean).join('');
  const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta name="robots" content="index,follow,max-image-preview:large" />
<link rel="canonical" href="${canonical}" />
<meta property="og:type" content="product" />
<meta property="og:site_name" content="미소주류 MISO ONE" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:image" content="${imageUrl}" />
<script type="application/ld+json">${JSON.stringify({
  '@context':'https://schema.org', '@type':'Product', name:product.name,
  category:product.category, description:product.description,
  countryOfOrigin: product.origin ? { '@type':'Country', name:product.origin } : undefined,
  url:canonical,
  brand:{ '@type':'Organization', name:'미소주류 MISO ONE' },
}).replaceAll('<','\\u003c')}</script>
<style>
:root{font-family:Pretendard,"Noto Sans KR",Arial,sans-serif;color:#172436;background:#f6f7f5}*{box-sizing:border-box}body{margin:0}a{text-decoration:none;color:inherit}.top{padding:18px 5%;background:#102a43;color:#fff;display:flex;justify-content:space-between;gap:20px}.top b{font-size:19px}.wrap{width:min(1040px,90%);margin:55px auto}.hero{display:grid;grid-template-columns:.85fr 1.15fr;gap:42px;align-items:center}.visual{aspect-ratio:1/1.15;border-radius:28px;background:linear-gradient(145deg,#e9edef,#fff);display:grid;place-items:center;overflow:hidden;border:1px solid #d9e0e3}.visual img{width:100%;height:100%;object-fit:contain}.placeholder{color:#7b8891;text-align:center;padding:30px}.tag{display:inline-block;padding:7px 11px;border-radius:999px;background:#f6ece9;color:#8c312a;font-weight:800;font-size:12px}h1{font-size:clamp(38px,6vw,68px);letter-spacing:-.055em;line-height:1.06;margin:18px 0;color:#102a43}p{line-height:1.8;color:#667985}.specs{list-style:none;padding:0;margin:28px 0;display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.specs li{background:#fff;border:1px solid #d9e0e3;border-radius:14px;padding:14px;display:flex;justify-content:space-between}.actions{display:flex;flex-wrap:wrap;gap:10px}.actions a{padding:14px 18px;border-radius:12px;font-weight:800}.primary{background:#9a302b;color:#fff}.secondary{background:#102a43;color:#fff}.ghost{background:#fff;border:1px solid #d9e0e3}.notice{margin-top:42px;padding:20px;border-radius:16px;background:#fff;border:1px solid #d9e0e3;color:#667985;font-size:13px}@media(max-width:760px){.hero{grid-template-columns:1fr}.wrap{margin-top:28px}.visual{max-height:430px}.specs{grid-template-columns:1fr}.actions{display:grid}.actions a{text-align:center}}
</style>
</head>
<body>
<header class="top"><a href="${siteUrl}/"><b>MISO ONE · 미소주류</b></a><a href="tel:0313363077">031-336-3077</a></header>
<main class="wrap">
<section class="hero">
<div class="visual"><img src="${imageUrl}" alt="${esc(product.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/><div class="placeholder" style="display:none">${esc(product.name)}<br/>제품 이미지 준비 중</div></div>
<div><span class="tag">${esc(product.category)}</span><h1>${esc(product.name)}</h1><p>${esc(product.description)}</p><ul class="specs">${specs}</ul><div class="actions"><a class="primary" href="tel:0313363077">전화 상담</a><a class="secondary" href="${searchUrl}">공급·견적 문의</a><a class="ghost" href="${blogUrl}" target="_blank" rel="noopener">블로그 자료 보기</a></div></div>
</section>
<div class="notice">업소용 주류 공급 여부와 거래 조건은 지역·업종·수량 등에 따라 달라질 수 있습니다. 정확한 조건은 미소주류 상담을 통해 확인해 주세요.</div>
</main>
</body></html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

const sitemapUrls = [
  `${siteUrl}/`, `${siteUrl}/startup-consulting`, `${siteUrl}/new-partner`, `${siteUrl}/privacy.html`, `${siteUrl}/terms.html`,
  ...products.map((p) => `${siteUrl}/products/${p.id}/`),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(publicDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
console.log(`Generated ${products.length} product SEO pages for ${siteUrl}`);
