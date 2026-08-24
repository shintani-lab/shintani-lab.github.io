// News 記事（content/news/ の Markdown）を読み込む設定です。
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/news' }),
  schema: z.object({
    date: z.coerce.date(),
    category: z.enum(['学会発表', '論文', '受賞', 'イベント']),
    title: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { news };
