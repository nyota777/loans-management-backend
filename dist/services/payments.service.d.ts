import { PaymentMethod } from "@prisma/client";
export interface CreatePaymentInput {
    loanId: string;
    amountPaid: number;
    paymentDate: string | Date;
    method: PaymentMethod;
    referenceCode?: string;
}
export declare function createPayment(data: CreatePaymentInput): Promise<{
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
}>;
export declare function confirmPayment(id: string, adminId: string, referenceCode?: string): Promise<{
    loan: {
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
    };
} & {
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
}>;
export declare function getPaymentsByLoanId(loanId: string): Promise<{
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
}[]>;
export declare function getPaymentsByMemberId(memberId: string): Promise<({
    loan: {
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
    };
} & {
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
})[]>;
export declare function getAllPayments(): Promise<({
    loan: {
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
    };
} & {
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
})[]>;
//# sourceMappingURL=payments.service.d.ts.map