/**
 * Zero-dependency CSV export. Replaces deprecated json2csv.
 */

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "object" && "toISOString" in (value as object)) {
    return String((value as Date).toISOString());
  }
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function toCsvSafeRow(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined && typeof v === "object" && "toISOString" in (v as object)) {
      out[k] = (v as Date).toISOString();
    } else {
      out[k] = v;
    }
  }
  return out;
}

export function exportToCsv<T extends Record<string, unknown>>(
  data: T[],
  fields?: string[]
): string {
  if (data.length === 0) {
    return "";
  }
  const keys = fields ?? (Object.keys(data[0]) as string[]);
  const header = keys.map(escapeCsvValue).join(",");
  const rows = data.map((row) =>
    keys.map((key) => escapeCsvValue((row as Record<string, unknown>)[key])).join(",")
  );
  return [header, ...rows].join("\r\n");
}

export default exportToCsv;
