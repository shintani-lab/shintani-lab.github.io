// content/ フォルダの YAML ファイルを読み込みます。
// サイトに出る文章はすべて content/ 側にあるので、
// 文章を直したいだけならこのファイルを触る必要はありません。
import fs from 'node:fs';
import path from 'node:path';
import { load as parseYaml } from 'js-yaml';

const CONTENT_DIR = path.join(process.cwd(), 'content');

function load<T>(filename: string): T {
  const file = path.join(CONTENT_DIR, filename);
  return parseYaml(fs.readFileSync(file, 'utf-8')) as T;
}

export type Site = {
  lab: { name_ja: string; name_en: string; short_name: string };
  professor: {
    name_ja: string; name_kana: string; name_en: string;
    title: string; affiliation: string;
    links: { researchmap: string; university: string };
  };
  location: {
    seminar: { campus: string; address: string };
    office: { campus: string; room: string };
  };
  contact: { email_masked: string };
  catchcopy: { main: string };
  keywords: string[];
};

export type Research = {
  introduction: string[];
  fields: string[];
  approach: { step: number; title: string; body: string }[];
  past_themes: string[];
};

export type Members = {
  faculty: { name: string; role: string; photo: string; profile: string;
             links: { researchmap: string } }[];
  students: { grade: string; theme: string; name?: string }[] | null;
  alumni: unknown[] | null;
};

export type Career = {
  policy: string;
  categories: string[];
  note: string;
};

export type Publications = {
  faculty: { policy: string; researchmap: string };
  students: { year: number; type: string; authors: string;
              title: string; venue: string; url: string }[] | null;
};

export const site = load<Site>('site.yaml');
export const research = load<Research>('research.yaml');
export const members = load<Members>('members.yaml');
export const career = load<Career>('career.yaml');
export const publications = load<Publications>('publications.yaml');

// 空リストが null として読み込まれることがあるため、配列に正規化します。
export const students = members.students ?? [];
export const studentPublications = publications.students ?? [];

// サイト全体のナビゲーション。ここが唯一の定義箇所です。
export const nav = [
  { href: '/',             label: 'ホーム',     en: 'Home' },
  { href: '/research/',    label: '研究内容',   en: 'Research' },
  { href: '/projects/',    label: '研究テーマ', en: 'Projects' },
  { href: '/members/',     label: 'メンバー',   en: 'Members' },
  { href: '/publications/',label: '業績',       en: 'Publications' },
  { href: '/news/',        label: 'News',       en: 'News' },
  { href: '/join/',        label: 'Join Us',    en: 'Join Us' },
  { href: '/contact/',     label: 'Contact',    en: 'Contact' },
];
