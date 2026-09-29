# 認知言語学・言語データ分析研究室 Webサイト

芝浦工業大学 認知言語学・言語データ分析研究室（新谷研）の公式Webサイトです。

- **公開サイト** https://shintani-lab.github.io/ （デザインは `gachi/`。2026年9月に切り替え）
- **大学公式の研究室ページ** https://www.shibaura-it.ac.jp/faculty/laboratory/00146.html

## 更新のしかた

**サイトの内容を更新したい方は [HANDOVER.md](./HANDOVER.md) をご覧ください。**
ブラウザ上のGitHubの画面だけで更新でき、開発環境の用意は不要です。

デザインの仕掛けや注意点は [gachi/HANDOVER.md](./gachi/HANDOVER.md) にあります。

## 構成

```
.
├── content/                サイトに載る文章・データ（更新の大半はここ）
│   ├── site.yaml               研究室名・教員情報・連絡先・所在地・説明文
│   ├── research.yaml           紹介文・研究分野・研究テーマ
│   ├── members.yaml            学生メンバー（教員は site.yaml 側）
│   ├── career.yaml             卒業後の進路
│   ├── publications.yaml       業績
│   └── news/                   お知らせ（1記事1ファイル）
├── public/                 画像など（favicon・OGP画像・robots.txt）
├── gachi/                  公開中のデザイン（通常は触りません）
│   ├── src/layouts/Layout.astro    全ページ共通のヘッダー・フッター
│   ├── src/components/             トップの解析・時間割表・学生アイコンなど
│   ├── src/pages/                  各ページ＋404・sitemap.xml
│   ├── src/styles/gachi.css        色・文字・余白の設定
│   └── src/lib/                    content/ の読み込み・品詞のデータなど
├── src/                    旧デザイン（2026年9月まで使用。戻すとき用に保管）
└── .github/workflows/      push すると自動で公開される設定
```

## 開発

```bash
npm ci
npm run dev          # 公開中のデザイン  http://localhost:4321
npm run build        # gachi/dist/ に出力（公開されるのはこれ）
npm run dev:old      # 旧デザイン（src/）
```

Node.js 22以上が必要です。

## 技術

| 項目 | 内容 |
|---|---|
| 生成 | Astro（静的サイト生成） |
| ホスティング | GitHub Pages |
| デプロイ | GitHub Actions（main への push で自動） |
| 依存 | Astro と js-yaml のみ。UIライブラリは不使用 |

依存を最小限にしているのは、担当者が毎年交代する前提のためです。
数年後も `npm install` が通る状態を保つことを優先しています。

## 注意

- **このリポジトリを OneDrive などの同期フォルダに置かないでください。**
  `node_modules` が同期対象になり、ビルドが壊れる原因になります。
- 掲載する氏名・写真・進路情報は個人情報です。本人の同意が取れた範囲のみ掲載します。
