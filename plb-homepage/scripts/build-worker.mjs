import { writeFile } from 'node:fs/promises';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are required');
}

const workerSource = [
  `const SUPABASE_URL = ${JSON.stringify(supabaseUrl)};`,
  `const SUPABASE_KEY = ${JSON.stringify(supabaseKey)};`,
  '',
  'export default {',
  '  async fetch(request, env) {',
  '    const url = new URL(request.url);',
  "    if (url.pathname === '/api/inquiries' && request.method === 'POST') {",
  '      try {',
  '        const input = await request.json();',
  '        const payload = {',
  "          company_name: String(input.company_name || '').trim().slice(0, 120),",
  "          phone: String(input.phone || '').trim().slice(0, 40),",
  "          subject: String(input.subject || '').trim().slice(0, 200),",
  "          message: String(input.message || '').trim().slice(0, 4000)",
  '        };',
  '        if (!payload.company_name || !payload.phone || !payload.subject || !payload.message) {',
  "          return Response.json({ message: '필수 입력 항목을 확인해주세요.' }, { status: 400 });",
  '        }',
  "        const response = await fetch(`${SUPABASE_URL}/rest/v1/inquiries`, {",
  "          method: 'POST',",
  '          headers: {',
  "            apikey: SUPABASE_KEY,",
  "            Authorization: `Bearer ${SUPABASE_KEY}`,",
  "            'Content-Type': 'application/json',",
  "            Prefer: 'return=minimal'",
  '          },',
  '          body: JSON.stringify(payload)',
  '        });',
  '        if (!response.ok) {',
  '          const detail = await response.text();',
  "          return Response.json({ message: detail || '데이터베이스 저장에 실패했습니다.' }, { status: response.status });",
  '        }',
  "        return Response.json({ ok: true }, { status: 201 });",
  '      } catch (error) {',
  "        return Response.json({ message: error.message || '문의 처리 중 오류가 발생했습니다.' }, { status: 502 });",
  '      }',
  '    }',
  '    return env.ASSETS.fetch(request);',
  '  }',
  '};',
  ''
].join('\n');

await writeFile(new URL('../dist-worker.js', import.meta.url), workerSource, 'utf8');
console.log('Created Cloudflare Worker entry');
