import { PaymentMethod } from "@prisma/client";
export interface CreateContributionInput {
    memberId: string;
    amount: number;
    date: string | Date;
    method: PaymentMethod;
    referenceCode?: string;
}
export declare function createContribution(data: CreateContributionInput): Promise<{
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
    id: string;
    createdAt: Date;
    updatedAt: Date;
    memberId: string;
    referenceCode: string | null;
    method: import(".prisma/client").$Enums.PaymentMethod;
    isConfirmed: boolean;
    confirmedAt: Date | null;
    confirmedByAdminId: string | null;
    date: Date;
    amount: number;
}>;
export declare function getContributions(memberId?: string): Promise<({
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
    id: string;
    createdAt: Date;
    updatedAt: Date;
    memberId: string;
    referenceCode: string | null;
    method: import(".prisma/client").$Enums.PaymentMethod;
    isConfirmed: boolean;
    confirmedAt: Date | null;
    confirmedByAdminId: string | null;
    date: Date;
    amount: number;
})[]>;
export declare function confirmContribution(id: string, adminId: string): Promise<{
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
    id: string;
    createdAt: Date;
    updatedAt: Date;
    memberId: string;
    referenceCode: string | null;
    method: import(".prisma/client").$Enums.PaymentMethod;
    isConfirmed: boolean;
    confirmedAt: Date | null;
    confirmedByAdminId: string | null;
    date: Date;
    amount: number;
}>;
//# sourceMappingURL=contributions.service.d.ts.map