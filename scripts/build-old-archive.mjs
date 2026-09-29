// 旧デザイン（直下の src/）を、参考用に /old/ の下へ置くためのスクリプトです。
// 2026年9月のデザイン切り替えの説明で、以前の見た目を見せるために作りました。
//
// やっていること
//   1. 旧デザインをビルドする（npm run build:old と同じ。出力は dist/）
//   2. 出力したHTMLのリンク・画像のパスを /old/ 付きに書き換える
//      （旧デザインのコードはリンクを "/research/" のように直接書いているため）
//   3. 検索結果に出さない設定と、「旧デザインです」という案内を付ける
//   4. 公開するフォルダ（gachi/dist）の中の old/ にコピーする
//
// 使い方：npm run build のあとに npm run build:archive
// 不要になったら：このファイルと、package.json の build:archive と、
//                 .github/workflows/deploy.yml の該当行を消すだけです。
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const PREFIX = '/old';
const SRC = 'dist';
const DEST = path.join('gachi', 'dist', 'old');
const CURRENT = 'https://shintani-lab.github.io/';

execSync('npx astro build', { stdio: 'inherit' });

// 旧版では不要なもの（検索エンジン向けのファイル、404ページ）
for (const f of ['sitemap.xml', 'robots.txt', '404.html']) {
  fs.rmSync(path.join(SRC, f), { force: true });
}

const banner = `
<div style="position:fixed;left:0;right:0;bottom:0;z-index:9999;display:flex;flex-wrap:wrap;gap:.5rem 1rem;align-items:center;justify-content:center;padding:.6rem 1rem;background:#13203a;color:#fff;font:600 14px/1.5 'Noto Sans JP',system-ui,sans-serif;box-shadow:0 -4px 16px rgba(0,0,0,.2)">
  <span>これは 2026年9月まで使っていた<b>旧デザイン</b>です（参考用）</span>
  <a href="${CURRENT}" style="color:#13203a;background:#fff;padding:.2rem .9rem;border-radius:999px;text-decoration:none">現在のサイトへ</a>
</div>`;

let count = 0;
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) { walk(p); continue; }
    if (!name.endsWith('.html')) continue;
    let html = fs.readFileSync(p, 'utf8');
    // "/..." で始まるリンク・画像に /old を付ける（"//" で始まる外部URLは除く）
    html = html.replace(/(href|src)="\/(?!\/)/g, `$1="${PREFIX}/`);
    // 正式なURLの指定を外し、検索結果に出さないようにする
    html = html.replace(/<link rel="canonical"[^>]*>/, '');
    if (!html.includes('name="robots"')) {
      html = html.replace('<head>', '<head><meta name="robots" content="noindex">');
    }
    html = html.replace('</body>', `${banner}</body>`);
    fs.writeFileSync(p, html);
    count++;
  }
}
walk(SRC);

fs.rmSync(DEST, { recursive: true, force: true });
fs.cpSync(SRC, DEST, { recursive: true });
console.log(`旧デザインを ${DEST} に置きました（HTML ${count} ファイル）`);
