import fs from 'node:fs';
import path from 'node:path';

const publicDir = path.resolve('public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');
const landingPath = path.join(publicDir, 'landing-sitemap-urls.txt');
if (!fs.existsSync(sitemapPath) || !fs.existsSync(landingPath)) process.exit(0);

let sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urls = fs.readFileSync(landingPath, 'utf8').split(/\r?\n/).map(v => v.trim()).filter(Boolean);
const additions = urls.filter(url => !sitemap.includes(`<loc>${url}</loc>`)).map(url => `  <url><loc>${url}</loc></url>`).join('\n');
if (additions) sitemap = sitemap.replace('</urlset>', `${additions}\n</urlset>`);
fs.writeFileSync(sitemapPath, sitemap);
fs.rmSync(landingPath, { force: true });
console.log(`Merged ${urls.length} landing-page URLs into sitemap.xml`);
