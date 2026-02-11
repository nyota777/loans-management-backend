/**
 * Normalizes a date to the start of the day (00:00:00.000)
 */
export declare function normalizeDate(date: Date | string): Date;
/**
 * Validates that a date is not in the past (earlier than today).
 * Returns true if valid (today or future), false otherwise.
 */
export declare function isFutureOrToday(date: Date | string): boolean;
/**
 * Throws an error if the date is in the past.
 */
export declare function validateFutureDate(date: Date | string, fieldName: string): void;
//# sourceMappingURL=date.d.ts.map