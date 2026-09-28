// ことばの「注釈」に関するデータと関数です。
// ・品詞の種類と色
// ・トップのキャッチコピーの解析結果（形態素・文節・係り受け）
// ・各ページのタイトルの品詞
// ・名前からのアイコン生成

export type PosKey = 'noun' | 'verb' | 'particle' | 'aux' | 'suffix' | 'symbol' | 'unknown';

// 品詞の表示名。色は styles/gachi.css の --noun などで決めています。
export const POS: Record<PosKey, string> = {
  noun: '名詞',
  verb: '動詞',
  particle: '助詞',
  aux: '助動詞',
  suffix: '接尾辞',
  symbol: '記号',
  unknown: '未知語',
};

export type Token = {
  s: string;          // 表層形（文に出てくる形）
  pos: PosKey;
  sub?: string;       // 品詞の細かい分類
  base?: string;      // 原形
  reading?: string;   // 読み
  form?: string;      // 活用形
};

export type Chunk = {
  tokens: Token[];
  head: number;       // 係り先の文節の番号（文末は -1）
};

const t = (s: string, pos: PosKey, extra: Omit<Token, 's' | 'pos'> = {}): Token => ({ s, pos, ...extra });

// ------------------------------------------------------------
// トップのキャッチコピーの解析結果（手作業で作成したもの）
// content/site.yaml の catchcopy を書き換えると一致しなくなるので、
// そのときは解析の演出をやめて、普通の見出しとして表示します。
// ------------------------------------------------------------
export const heroParse: Chunk[] = [
  { head: 1, tokens: [
    t('ことば', 'noun', { reading: 'コトバ' }),
    t('と', 'particle', { sub: '並立助詞', reading: 'ト' }),
  ] },
  { head: 3, tokens: [
    t('こころ', 'noun', { reading: 'ココロ' }),
    t('を', 'particle', { sub: '格助詞', reading: 'ヲ' }),
  ] },
  { head: 3, tokens: [
    t('データ', 'noun', { reading: 'データ' }),
    t('で', 'particle', { sub: '格助詞', reading: 'デ' }),
  ] },
  { head: 6, tokens: [
    t('捉え', 'verb', { base: '捉える', form: '連用形', reading: 'トラエ' }),
    t('、', 'symbol', { sub: '読点' }),
  ] },
  { head: 5, tokens: [
    t('見え', 'verb', { base: '見える', form: '未然形', reading: 'ミエ' }),
    t('ない', 'aux', { reading: 'ナイ' }),
  ] },
  { head: 6, tokens: [
    t('構造', 'noun', { reading: 'コウゾウ' }),
    t('を', 'particle', { sub: '格助詞', reading: 'ヲ' }),
  ] },
  { head: -1, tokens: [
    t('可視', 'noun', { reading: 'カシ' }),
    t('化', 'suffix', { reading: 'カ' }),
    t('する', 'verb', { base: 'する', form: '終止形', reading: 'スル' }),
    t('。', 'symbol', { sub: '句点' }),
  ] },
];

export function parseFor(text: string): Chunk[] | null {
  const joined = heroParse.flatMap((c) => c.tokens.map((tk) => tk.s)).join('');
  return joined === text.trim() ? heroParse : null;
}

// ------------------------------------------------------------
// 各ページのタイトル（品詞つき）
// ------------------------------------------------------------
export const titles = {
  research: [t('研究', 'noun'), t('内容', 'noun')],
  projects: [t('研究', 'noun'), t('テーマ', 'noun')],
  members: [t('メンバー', 'noun')],
  publications: [t('業績', 'noun')],
  news: [t('お知らせ', 'noun')],
  join: [
    t('配属', 'noun'), t('を', 'particle'), t('検討', 'noun'), t('し', 'verb'),
    t('て', 'particle'), t('いる', 'verb'), t('方', 'noun'), t('へ', 'particle'),
  ],
  contact: [t('連絡', 'noun'), t('先', 'suffix')],
  notFound: [
    t('ページ', 'noun'), t('が', 'particle'), t('見つかり', 'verb'),
    t('ませ', 'aux'), t('ん', 'aux'),
  ],
} satisfies Record<string, Token[]>;

// ------------------------------------------------------------
// 名前から作るアイコン（5×5の左右対称のドット絵）
// 同じ名前からは必ず同じ模様になります。
// ------------------------------------------------------------
function hash(s: string) {
  let h = 0x811c9dc5;
  for (const ch of s) {
    h ^= ch.codePointAt(0)!;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

const ICON_COLORS: PosKey[] = ['noun', 'verb', 'particle', 'aux', 'suffix'];

export function identicon(name: string) {
  const h = hash(name);
  const h2 = hash(name + '*');
  const cells: boolean[][] = [];
  let filled = 0;
  for (let row = 0; row < 5; row++) {
    const line: boolean[] = [];
    for (let col = 0; col < 3; col++) {
      const on = ((h2 >>> (row * 3 + col)) & 1) === 1;
      if (on) filled++;
      line.push(on);
    }
    cells.push([line[0], line[1], line[2], line[1], line[0]]);
  }
  // 塗りが少なすぎると寂しいので、中央の列を足します
  if (filled < 5) for (let row = 0; row < 5; row++) cells[row][2] = true;
  return { cells, color: ICON_COLORS[h % ICON_COLORS.length] };
}

// 「」で囲まれた部分を見つけて、強調できるように分けます
export function splitQuotes(text: string) {
  return text.split(/(「[^」]+」)/).filter(Boolean).map((part) => ({
    text: part,
    quote: part.startsWith('「') && part.endsWith('」'),
  }));
}

// 文章の中の指定した語に印を付けます（研究室名の中の語には付けません）
export function markTerms(text: string, terms: string[], avoid: string) {
  const out: { text: string; mark?: PosKey }[] = [];
  const colors: PosKey[] = ['noun', 'verb', 'particle', 'aux', 'suffix'];
  let i = 0;
  let plain = '';
  let n = 0;
  const used = new Set<string>();
  while (i < text.length) {
    if (avoid && text.startsWith(avoid, i)) {
      plain += avoid;
      i += avoid.length;
      continue;
    }
    const term = terms.find((w) => !used.has(w) && text.startsWith(w, i));
    if (term) {
      if (plain) out.push({ text: plain });
      plain = '';
      out.push({ text: term, mark: colors[n++ % colors.length] });
      used.add(term);
      i += term.length;
    } else {
      plain += text[i++];
    }
  }
  if (plain) out.push({ text: plain });
  return out;
}

// お知らせ・業績の種類に色（品詞の色）を割り当てます
export function catPos(category: string): PosKey {
  if (/論文/.test(category)) return 'noun';
  if (/発表/.test(category)) return 'verb';
  if (/受賞/.test(category)) return 'suffix';
  if (/イベント/.test(category)) return 'particle';
  return 'aux';
}

// 色を順番に割り当てるときの並び
export const CYCLE: PosKey[] = ['noun', 'verb', 'particle', 'aux', 'suffix'];

// 見出しを、単語の途中で折り返さないように区切ります（「を」「は」「が」「へ」「、」「・」の後ろ）
export function phrases(text: string) {
  return text.split(/(?<=[をはがへ、・])/).filter(Boolean);
}
