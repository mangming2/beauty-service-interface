/** 상품 폼: "1, 2, 5" 등 → 중복 제거된 양의 정수 ID 목록 */
export function parseOptionIds(text: string): number[] {
  const seen = new Set<number>();
  const out: number[] = [];
  for (const part of text.split(/[,，\s]+/)) {
    const n = parseInt(part.trim(), 10);
    if (!Number.isFinite(n) || n <= 0) continue;
    if (seen.has(n)) continue;
    seen.add(n);
    out.push(n);
  }
  return out;
}
