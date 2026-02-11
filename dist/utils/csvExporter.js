/**
 * Zero-dependency CSV export. Replaces deprecated json2csv.
 */
function escapeCsvValue(value) {
    if (value === null || value === undefined) {
        return "";
    }
    if (typeof value === "object" && "toISOString" in value) {
        return String(value.toISOString());
    }
    const s = String(value);
    if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
        return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
}
export function toCsvSafeRow(obj) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
        if (v !== null && v !== undefined && typeof v === "object" && "toISOString" in v) {
            out[k] = v.toISOString();
        }
        else {
            out[k] = v;
        }
    }
    return out;
}
export function exportToCsv(data, fields) {
    if (data.length === 0) {
        return "";
    }
    const keys = fields ?? Object.keys(data[0]);
    const header = keys.map(escapeCsvValue).join(",");
    const rows = data.map((row) => keys.map((key) => escapeCsvValue(row[key])).join(","));
    return [header, ...rows].join("\r\n");
}
export default exportToCsv;
//# sourceMappingURL=csvExporter.js.map