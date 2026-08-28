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
  lab: { name_ja: string; name_en: string };
  professor: {
    name_ja: string; name_kana: string;
    title: string; affiliation: string;
    affiliation_lines: string[];
    profile: string;
    profile_extra: { label: string; body: string }[] | null;
    links: { researchmap: string; university: string };
  };
  location: {
    seminar: { campus: string; address: string };
    office: { campus: string; room: string };
  };
  contact: { email_masked: string };
  catchcopy: { main: string };
  description: string;
  graphic_words: string[];
};

export type Research = {
  lead_top: string;
  introduction: string[];
  fields: string[];
  approach: { step: number; title: string; body: string }[];
  themes: string[];
  student_themes: string[];
};

export type Members = {
  // 教員の情報は site.yaml で管理しています。
  students: { grade: string; name?: string; theme?: string }[] | null;
};

export type Career = {
  categories: string[];
  note: string;
};

export type Join = {
  seminar: { intro: string; slots: string[]; note: string };
};

export type Publications = {
  faculty: { researchmap: string };
  students: { year: number; type: string; authors: string;
              title: string; venue: string; url: string }[] | null;
};

export const site = load<Site>('site.yaml');
export const research = load<Research>('research.yaml');
export const members = load<Members>('members.yaml');
export const career = load<Career>('career.yaml');
export const publications = load<Publications>('publications.yaml');
export const join = load<Join>('join.yaml');

// 空リストが null として読み込まれることがあるため、配列に正規化します。
export const students = members.students ?? [];
export const professorExtra = site.professor.profile_extra ?? [];

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
export const studentPublications = publications.students ?? [];

// サイト全体のナビゲーション。ここが唯一の定義箇所です。
// label = 大きく出る文字、sub = その下に小さく出る補助の文字。
export const nav = [
  { href: '/',             label: 'ホーム',     sub: 'Home' },
  { href: '/research/',    label: '研究内容',   sub: 'Research' },
  { href: '/projects/',    label: '研究テーマ', sub: 'Projects' },
  { href: '/members/',     label: 'メンバー',   sub: 'Members' },
  { href: '/publications/',label: '業績',       sub: 'Publications' },
  { href: '/news/',        label: 'News',       sub: 'お知らせ' },
  { href: '/join/',        label: 'Join Us',    sub: '配属希望' },
  { href: '/contact/',     label: 'Contact',    sub: '連絡先' },
];
