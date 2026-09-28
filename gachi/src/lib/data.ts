// 本番サイトと同じ content/ フォルダの文章を読み込みます。
// このフォルダ（gachi/）には文章を置いていないので、
// 先生の文言を直すときは本番と同じく content/ の YAML を直せば両方に反映されます。
import { load as parseYaml } from 'js-yaml';
import type {
  Site, Research, Members, Career, Join, Publications,
} from './types';

import siteRaw from '../../../content/site.yaml?raw';
import researchRaw from '../../../content/research.yaml?raw';
import membersRaw from '../../../content/members.yaml?raw';
import careerRaw from '../../../content/career.yaml?raw';
import joinRaw from '../../../content/join.yaml?raw';
import publicationsRaw from '../../../content/publications.yaml?raw';

export const site = parseYaml(siteRaw) as Site;
export const research = parseYaml(researchRaw) as Research;
export const members = parseYaml(membersRaw) as Members;
export const career = parseYaml(careerRaw) as Career;
export const join = parseYaml(joinRaw) as Join;
export const publications = parseYaml(publicationsRaw) as Publications;

// 空リストが null として読み込まれることがあるため、配列に正規化します。
export const students = members.students ?? [];
export const professorExtra = site.professor.profile_extra ?? [];
export const studentPublications = publications.students ?? [];

// 学生を学年ごとにまとめます（YAMLに書いた順序を保ちます）。
export const studentsByGrade = students.reduce<{ grade: string; list: typeof students }[]>(
  (acc, s) => {
    const found = acc.find((g) => g.grade === s.grade);
    if (found) found.list.push(s);
    else acc.push({ grade: s.grade, list: [s] });
    return acc;
  },
  []
);

// 業績を年ごとにまとめます（新しい年が先）。
export const publicationsByYear = [...new Set(studentPublications.map((p) => p.year))]
  .sort((a, b) => b - a)
  .map((year) => ({ year, list: studentPublications.filter((p) => p.year === year) }));

// News（content/news/ の Markdown）
type NewsModule = {
  frontmatter: {
    date: string | Date;
    date_label?: string;
    category: string;
    title: string;
    draft?: boolean;
  };
  compiledContent: () => string | Promise<string>;
};

const newsModules = import.meta.glob<NewsModule>('../../../content/news/*.md', { eager: true });

export const news = await Promise.all(
  Object.entries(newsModules)
    .filter(([, m]) => !m.frontmatter.draft)
    .map(async ([file, m]) => ({
      // ファイル名（.md を除く）が、記事ページのURLになります
      id: file.split('/').pop()!.replace(/.md$/, ''),
      date: new Date(m.frontmatter.date),
      date_label: m.frontmatter.date_label,
      category: m.frontmatter.category,
      title: m.frontmatter.title,
      // Markdown の改行が日本語の間に余計な空白として出ないよう、詰めておきます。
      html: String(await m.compiledContent()).replace(/([^\x00-\x7F])\n(?=[^\x00-\x7F])/g, '$1'),
    }))
).then((list) => list.sort((a, b) => b.date.valueOf() - a.date.valueOf()));

// ------------------------------------------------------------
// 公開場所に合わせたURL
// 比較用に /gachi/ の下で公開しているときは、サイト内のリンクや画像の先頭に /gachi が付きます。
// サイト内のリンクは、必ず url('/research/') のようにこの関数を通して書いてください。
// ------------------------------------------------------------
const BASE = import.meta.env.BASE_URL.replace(/[/]+$/, '');
export const url = (p: string) => (p.startsWith('/') && !p.startsWith('//') ? BASE + p : p);

// 比較用（本番とは別の場所）で公開しているかどうか
export const isPreview = BASE !== '';
export const PRODUCTION_URL = 'https://shintani-lab.github.io/';

// ページの一覧（ヘッダー・フッター・サイトマップで使います）
export const nav = [
  { href: '/research/',     label: '研究内容',   en: 'Research' },
  { href: '/projects/',     label: '研究テーマ', en: 'Projects' },
  { href: '/members/',      label: 'メンバー',   en: 'Members' },
  { href: '/publications/', label: '業績',       en: 'Publications' },
  { href: '/news/',         label: 'お知らせ',   en: 'News' },
  { href: '/contact/',      label: '連絡先',     en: 'Contact' },
];

export const pad2 = (n: number) => String(n).padStart(2, '0');
