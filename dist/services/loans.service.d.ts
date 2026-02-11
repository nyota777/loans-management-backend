import { LoanType } from "@prisma/client";
export interface CreateLoanInput {
    memberId: string;
    principalAmount: number;
    loanDurationMonths: number;
    type?: LoanType;
}
export declare function createLoan(data: CreateLoanInput): Promise<{
    member: {
        id: string;
        phoneNumber: string;
        fullName: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        idNumber: string;
        totalContributions: number;
    };
} & {
    type: import(".prisma/client").$Enums.LoanType;
    status: string;
    id: string;
    createdAt: Date;
    principalAmount: number;
    interestRate: number;
    loanDurationMonths: number;
    interestAmount: number;
    totalPayable: number;
    monthlyInstallment: number;
    remainingBalance: number;
    startDate: Date;
    expectedEndDate: Date;
    memberId: string;
}>;
export declare function getLoans(status?: string): Promise<({
    member: {
        id: string;
        phoneNumber: string;
        fullName: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        idNumber: string;
        totalContributions: number;
    };
} & {
    type: import(".prisma/client").$Enums.LoanType;
    status: string;
    id: string;
    createdAt: Date;
    principalAmount: number;
    interestRate: number;
    loanDurationMonths: number;
    interestAmount: number;
    totalPayable: number;
    monthlyInstallment: number;
    remainingBalance: number;
    startDate: Date;
    expectedEndDate: Date;
    memberId: string;
})[]>;
export declare function getLoanById(id: string): Promise<({
    member: {
        id: string;
        phoneNumber: string;
        fullName: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        idNumber: string;
        totalContributions: number;
    };
    payments: {
        id: string;
        remainingBalance: number;
        referenceCode: string | null;
        loanId: string;
        amountPaid: number;
        paymentDate: Date;
        paymentNumber: number;
        isLate: boolean;
        penaltyAmount: number;
        method: import(".prisma/client").$Enums.PaymentMethod;
        isConfirmed: boolean;
        confirmedAt: Date | null;
        confirmedByAdminId: string | null;
    }[];
} & {
    type: import(".prisma/client").$Enums.LoanType;
    status: string;
    id: string;
    createdAt: Date;
    principalAmount: number;
    interestRate: number;
    loanDurationMonths: number;
    interestAmount: number;
    totalPayable: number;
    monthlyInstallment: number;
    remainingBalance: number;
    startDate: Date;
    expectedEndDate: Date;
    memberId: string;
}) | null>;
export declare function getLoansByMemberId(memberId: string): Promise<({
    payments: {
        id: string;
        remainingBalance: number;
        referenceCode: string | null;
        loanId: string;
        amountPaid: number;
        paymentDate: Date;
        paymentNumber: number;
        isLate: boolean;
        penaltyAmount: number;
        method: import(".prisma/client").$Enums.PaymentMethod;
        isConfirmed: boolean;
        confirmedAt: Date | null;
        confirmedByAdminId: string | null;
    }[];
} & {
    type: import(".prisma/client").$Enums.LoanType;
    status: string;
    id: string;
    createdAt: Date;
    principalAmount: number;
    interestRate: number;
    loanDurationMonths: number;
    interestAmount: number;
    totalPayable: number;
    monthlyInstallment: number;
    remainingBalance: number;
    startDate: Date;
    expectedEndDate: Date;
    memberId: string;
})[]>;
export declare function updateLoanStatus(id: string, status: string): Promise<{
    member: {
        id: string;
        phoneNumber: string;
        fullName: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        idNumber: string;
        totalContributions: number;
    };
} & {
    type: import(".prisma/client").$Enums.LoanType;
    status: string;
    id: string;
    createdAt: Date;
    principalAmount: number;
    interestRate: number;
    loanDurationMonths: number;
    interestAmount: number;
    totalPayable: number;
    monthlyInstallment: number;
    remainingBalance: number;
    startDate: Date;
    expectedEndDate: Date;
    memberId: string;
}>;
//# sourceMappingURL=loans.service.d.ts.map