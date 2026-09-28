// 日付の表示形式をまとめています。
// 例: 2026.04.01
export const formatDot = (d: Date) =>
  `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;

// 例: 2026年4月1日
export const formatJa = (d: Date) =>
  `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
