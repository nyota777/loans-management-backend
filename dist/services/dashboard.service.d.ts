export interface DashboardSummary {
    totalMembers: number;
    activeLoans: number;
    totalLoanedAmount: number;
    interestEarned: number;
    penaltiesCollected: number;
    overdueLoans: number;
    clearedLoans: number;
}
export declare function getDashboardSummary(): Promise<DashboardSummary>;
//# sourceMappingURL=dashboard.service.d.ts.map