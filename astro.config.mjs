import { defineConfig } from 'astro/config';

// リポジトリ名が shintani-lab.github.io のため、公開URLは
// https://shintani-lab.github.io/ （サブディレクトリなし）になります。
// そのため base の指定は不要です。
export default defineConfig({
  site: 'https://shintani-lab.github.io',
});
