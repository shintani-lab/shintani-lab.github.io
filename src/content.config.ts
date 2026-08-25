// News 記事（content/news/ の Markdown）を読み込む設定です。
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/news' }),
  schema: z.object({
    date: z.coerce.date(),
    // カテゴリはそのままタグとして表示されます。
    // 「学会発表 / 論文 / 受賞 / イベント / お知らせ」から選ぶことを推奨しますが、
    // 別の言葉を書いてもエラーにはなりません。
    // （決められた語だけを許す書き方にすると、1文字の書き間違いで
    //   サイト全体が公開できなくなるため、あえて緩くしています）
    category: z.string(),
    title: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { news };
