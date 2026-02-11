export const FIXED_INTEREST_RATE = 12.5;
export const MAX_LOAN_DURATION_MONTHS = 48;
/**
 * Calculate loan figures at 12.5% per annum.
 * interestAmount = principal * (rate/100) * (months/12)
 */
export function calculateLoan(principalAmount, loanDurationMonths, interestRate = FIXED_INTEREST_RATE) {
    if (loanDurationMonths > MAX_LOAN_DURATION_MONTHS) {
        throw new Error(`Loan duration cannot exceed ${MAX_LOAN_DURATION_MONTHS} months`);
    }
    if (loanDurationMonths < 1 || principalAmount <= 0) {
        throw new Error("Invalid principal or duration");
    }
    const interestAmount = Math.round(principalAmount * (interestRate / 100) * (loanDurationMonths / 12) * 100) / 100;
    const totalPayable = Math.round((principalAmount + interestAmount) * 100) / 100;
    const monthlyInstallment = Math.round((totalPayable / loanDurationMonths) * 100) / 100;
    return {
        interestAmount,
        totalPayable,
        monthlyInstallment,
    };
}
/**
 * Compute late penalty amount from overdue amount and penalty percentage.
 */
export function calculateLatePenalty(amount, penaltyPercent) {
    return Math.round((amount * (penaltyPercent / 100)) * 100) / 100;
}
//# sourceMappingURL=loanCalculator.js.map