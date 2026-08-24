# 認知言語学・言語データ分析研究室 Webサイト

芝浦工業大学 認知言語学・言語データ分析研究室（新谷研）の公式Webサイトです。

- **公開サイト** https://shintani-lab.github.io/
- **大学公式の研究室ページ** https://www.shibaura-it.ac.jp/faculty/laboratory/00146.html

## 更新のしかた

**サイトの内容を更新したい方は [HANDOVER.md](./HANDOVER.md) をご覧ください。**
ブラウザ上のGitHubの画面だけで更新でき、開発環境の用意は不要です。

## 構成

```
.
├── content/                サイトに載る文章・データ（更新はここだけ）
│   ├── site.yaml               研究室名・連絡先・所在地
│   ├── research.yaml           紹介文・研究分野・テーマ例
│   ├── members.yaml            メンバー
│   ├── career.yaml             卒業後の進路
│   ├── publications.yaml       業績
│   └── news/                   お知らせ（1記事1ファイル）
├── src/                    サイトの見た目（通常は触りません）
│   ├── layouts/Base.astro      全ページ共通のヘッダー・フッター
│   ├── components/             共通部品
│   ├── pages/                  各ページ
│   ├── styles/global.css       色・文字・余白の設定
│   └── lib/content.ts          content/ を読み込む処理
├── docs/                   打合せ資料
└── .github/workflows/      push すると自動で公開される設定
```

## 開発

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ に出力
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
