/**
 * Normalizes a date to the start of the day (00:00:00.000)
 */
export function normalizeDate(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}
/**
 * Validates that a date is not in the past (earlier than today).
 * Returns true if valid (today or future), false otherwise.
 */
export function isFutureOrToday(date) {
    const inputDate = normalizeDate(date);
    const today = normalizeDate(new Date());
    return inputDate.getTime() >= today.getTime();
}
/**
 * Throws an error if the date is in the past.
 */
export function validateFutureDate(date, fieldName) {
    if (!isFutureOrToday(date)) {
        throw new Error(`${fieldName} cannot be in the past`);
    }
}
//# sourceMappingURL=date.js.map