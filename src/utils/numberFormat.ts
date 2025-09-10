// Utility to format large numbers with compact suffixes (K, M, B)
// 950 -> "950"
// 1_200 -> "1.2K"
// 1_200_000 -> "1.2M"
// 1_200_000_000 -> "1.2B"
export function formatCompactNumber(value: number): string {
  if (value === undefined || value === null || isNaN(value as any)) return "0";
  const abs = Math.abs(value);

  const format = (num: number, suffix: string) => {
    const n = num >= 100 ? num.toFixed(0) : num.toFixed(1);
    return `${n}${suffix}`;
  };

  if (abs >= 1_000_000_000) return format(value / 1_000_000_000, "B");
  if (abs >= 1_000_000) return format(value / 1_000_000, "M");
  if (abs >= 1_000) return format(value / 1_000, "K");
  return String(value);
}
