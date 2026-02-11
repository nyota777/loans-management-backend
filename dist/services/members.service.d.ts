export interface CreateMemberInput {
    fullName: string;
    phoneNumber: string;
    idNumber: string;
    totalContributions?: number;
}
export interface UpdateMemberInput {
    fullName?: string;
    phoneNumber?: string;
    idNumber?: string;
    totalContributions?: number;
    isActive?: boolean;
}
export declare function createMember(data: CreateMemberInput): Promise<{
    id: string;
    phoneNumber: string;
    fullName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    idNumber: string;
    totalContributions: number;
}>;
export declare function getMembers(includeInactive?: boolean): Promise<({
    _count: {
        loans: number;
    };
} & {
    id: string;
    phoneNumber: string;
    fullName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    idNumber: string;
    totalContributions: number;
})[]>;
export declare function getMemberById(id: string): Promise<({
    loans: {
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
    }[];
} & {
    id: string;
    phoneNumber: string;
    fullName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    idNumber: string;
    totalContributions: number;
}) | null>;
export declare function updateMember(id: string, data: UpdateMemberInput): Promise<{
    id: string;
    phoneNumber: string;
    fullName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    idNumber: string;
    totalContributions: number;
}>;
export declare function softDeleteMember(id: string): Promise<{
    id: string;
    phoneNumber: string;
    fullName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    idNumber: string;
    totalContributions: number;
}>;
//# sourceMappingURL=members.service.d.ts.map