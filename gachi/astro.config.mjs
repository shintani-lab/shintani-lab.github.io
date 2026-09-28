import { defineConfig } from 'astro/config';

// 試作版（ガチ版）の設定です。
// GACHI_BASE を指定すると、そのパスの下に公開します。
//   比較用に https://shintani-lab.github.io/gachi/ で公開するとき … GACHI_BASE=/gachi/
//   本番として https://shintani-lab.github.io/ で公開するとき   … 指定しない
// 文章（content/）と画像（public/）は、本番サイトと同じものを1つ上の階層から読み込みます。
// Astro などの部品も、1つ上の階層の node_modules をそのまま使います（追加のインストールは不要）。
export default defineConfig({
  site: 'https://shintani-lab.github.io',
  base: process.env.GACHI_BASE || '/',
  publicDir: '../public',
  vite: {
    server: { fs: { allow: ['..'] } },
  },
});
