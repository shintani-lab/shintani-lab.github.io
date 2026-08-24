// News 記事の読み込みをまとめています。
// draft: true の記事は除き、新しい順に並べ替えて返します。
import { getCollection } from 'astro:content';

export async function getPublishedNews() {
  const items = await getCollection('news', ({ data }) => !data.draft);
  return items.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
