# 認知言語学・言語データ分析研究室（新谷研） Webサイト

芝浦工業大学 新谷研究室の公式Webサイトのソースコードです。

- 公開URL: （未定）
- 大学公式の研究室ページ: https://www.shibaura-it.ac.jp/faculty/laboratory/00146.html

## いまの状態

**打合せ前の準備段階です。** 技術選定・構成は新谷先生との相談で確定します。
現時点で入っているのは、大学HPから起こしたコンテンツ素案（`content/`）と
公開用の設定ファイルのみで、サイト本体はまだ実装していません。

## ディレクトリ構成（予定）

```
.
├── content/          テキスト・データ（ここだけ触れば更新できる設計にする）
│   ├── site.yaml         研究室名・連絡先など基本情報
│   ├── research.yaml     研究内容
│   ├── members.yaml      メンバー
│   ├── career.yaml       就職先
│   ├── publications.yaml 業績
│   └── news/             お知らせ（Markdown 1記事1ファイル）
├── docs/             打合せ資料・確認事項
├── src/              サイト本体（Astro。打合せ後に作成）
└── .github/workflows/deploy.yml   push すると自動公開
```

## 開発（技術確定後）

```bash
npm install      # 初回のみ
npm run dev      # http://localhost:4321 で確認
npm run build    # dist/ に本番ファイルを出力
```

## 更新のしかた

日常の更新方法は [HANDOVER.md](./HANDOVER.md) にまとめています。

## メモ

- **このリポジトリは OneDrive 同期フォルダの外に置くこと。** `node_modules` を
  OneDrive が同期しようとしてビルドが遅くなる／壊れる原因になります。
- 掲載する氏名・写真・就職先は個人情報です。本人同意の取れた範囲のみ掲載します。
