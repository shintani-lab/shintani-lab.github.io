// 研究分野の名前から、表示するアイコンを決めます。
// 上から順に照合し、最初に当てはまったものを使います。
// 分野名を書き換えてもだいたい当たるようにしてあり、
// どれにも当てはまらない場合は丸印（dot）になります。
const rules: [string, string][] = [
  ['Python', 'code'],
  ['プログラ', 'code'],
  ['テキスト', 'text'],
  ['言語データ', 'text'],
  ['認知', 'network'],
  ['心理', 'gauge'],
  ['測定', 'gauge'],
  ['教育', 'cap'],
  ['学習', 'cap'],
  ['統計', 'chart'],
  ['分析', 'chart'],
];

export function iconForField(name: string): string {
  for (const [keyword, icon] of rules) {
    if (name.includes(keyword)) return icon;
  }
  return 'dot';
}
