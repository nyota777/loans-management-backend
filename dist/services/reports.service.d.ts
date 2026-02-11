export declare function getLoansReport(): Promise<{
    id: string;
    memberId: string;
    memberName: string;
    phoneNumber: string;
    principalAmount: number;
    interestRate: number;
    loanDurationMonths: number;
    interestAmount: number;
    totalPayable: number;
    monthlyInstallment: number;
    remainingBalance: number;
    startDate: Date;
    expectedEndDate: Date;
    status: string;
    createdAt: Date;
}[]>;
export declare function getPaymentsReport(): Promise<{
    id: string;
    loanId: string;
    memberId: string;
    memberName: string;
    amountPaid: number;
    paymentDate: Date;
    remainingBalance: number;
    paymentNumber: number;
    isLate: boolean;
    penaltyAmount: number;
}[]>;
export declare function getOverdueLoansReport(): Promise<{
    id: string;
    memberId: string;
    memberName: string;
    phoneNumber: string;
    principalAmount: number;
    remainingBalance: number;
    monthlyInstallment: number;
    expectedEndDate: Date;
    startDate: Date;
    status: string;
}[]>;
export declare function getMemberLoanHistory(memberId: string): Promise<{
    id: string;
    memberId: string;
    memberName: string;
    principalAmount: number;
    interestAmount: number;
    totalPayable: number;
    remainingBalance: number;
    monthlyInstallment: number;
    startDate: Date;
    expectedEndDate: Date;
    status: string;
    payments: {
        id: string;
        amountPaid: number;
        paymentDate: Date;
        paymentNumber: number;
        isLate: boolean;
        penaltyAmount: number;
    }[];
    createdAt: Date;
}[]>;
//# sourceMappingURL=reports.service.d.ts.map