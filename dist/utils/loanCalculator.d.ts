export declare const FIXED_INTEREST_RATE = 12.5;
export declare const MAX_LOAN_DURATION_MONTHS = 48;
export interface LoanCalculationResult {
    interestAmount: number;
    totalPayable: number;
    monthlyInstallment: number;
}
/**
 * Calculate loan figures at 12.5% per annum.
 * interestAmount = principal * (rate/100) * (months/12)
 */
export declare function calculateLoan(principalAmount: number, loanDurationMonths: number, interestRate?: number): LoanCalculationResult;
/**
 * Compute late penalty amount from overdue amount and penalty percentage.
 */
export declare function calculateLatePenalty(amount: number, penaltyPercent: number): number;
//# sourceMappingURL=loanCalculator.d.ts.map