/**
 * Zero-dependency CSV export. Replaces deprecated json2csv.
 */
export declare function toCsvSafeRow(obj: Record<string, unknown>): Record<string, unknown>;
export declare function exportToCsv<T extends Record<string, unknown>>(data: T[], fields?: string[]): string;
export default exportToCsv;
//# sourceMappingURL=csvExporter.d.ts.map