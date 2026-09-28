// content/ の YAML の形（本番の src/lib/content.ts と同じ定義です）。
// YAML に項目を足したときは、ここにも同じ名前で足してください。

export type Site = {
  lab: { name_ja: string; name_en: string };
  professor: {
    name_ja: string; name_kana: string;
    title: string; affiliation: string;
    affiliation_lines: string[];
    photo: string; photo_width: number; photo_height: number; photo_alt: string;
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
  // 研究内容ページの図（データ分析の工程）
  pipeline: {
    box: string;
    detail?: string;
    chips?: string[];
    arrow?: string;
  }[] | null;
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
  admission: { label: string; body: string }[] | null;
  photos: { src: string; width: number; height: number; alt: string; caption: string }[] | null;
};

export type Publications = {
  faculty: { researchmap: string };
  students: { year: number; type: string; authors: string;
              title: string; venue: string; url: string }[] | null;
};
