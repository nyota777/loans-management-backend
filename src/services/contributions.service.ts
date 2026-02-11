import { prisma } from "../utils/prisma.js";
import { PaymentMethod, Prisma } from "@prisma/client";
import { validateFutureDate } from "../utils/date.js";

export interface CreateContributionInput {
    memberId: string;
    amount: number;
    date: string | Date; // ISO string or Date object
    method: PaymentMethod;
    referenceCode?: string;
}

export async function createContribution(data: CreateContributionInput) {
    validateFutureDate(data.date, "Contribution date");

    // Basic validation
    if (data.amount <= 0) {
        throw new Error("Contribution amount must be positive");
    }
    if (data.method === "MPESA" && !data.referenceCode) {
        throw new Error("Reference code is required for M-Pesa contributions");
    }

    // Check unique reference code if provided
    if (data.referenceCode) {
        const existing = await prisma.contribution.findUnique({
            where: { referenceCode: data.referenceCode },
        });
        if (existing) {
            throw new Error(`Reference code ${data.referenceCode} already used`);
        }
    }

    const contribution = await prisma.contribution.create({
        data: {
            memberId: data.memberId,
            amount: data.amount,
            date: new Date(data.date),
            method: data.method,
            referenceCode: data.referenceCode,
            isConfirmed: false, // Pending by default
        },
        include: { member: true },
    });

    return contribution;
}

export async function getContributions(memberId?: string) {
    const where: Prisma.ContributionWhereInput = {};
    if (memberId) {
        where.memberId = memberId;
    }

    const contributions = await prisma.contribution.findMany({
        where,
        orderBy: { date: "desc" },
        include: { member: true },
    });
    return contributions;
}

export async function confirmContribution(id: string, adminId: string) {
    const contribution = await prisma.contribution.findUnique({
        where: { id },
        include: { member: true },
    });

    if (!contribution) {
        throw new Error("Contribution not found");
    }
    if (contribution.isConfirmed) {
        throw new Error("Contribution is already confirmed");
    }

    const confirmed = await prisma.$transaction(async (tx) => {
        // 1. Confirm contribution
        const updated = await tx.contribution.update({
            where: { id },
            data: {
                isConfirmed: true,
                confirmedAt: new Date(),
                confirmedByAdminId: adminId,
            },
            include: { member: true },
        });

        // 2. Update member totals
        await tx.member.update({
            where: { id: contribution.memberId },
            data: {
                totalContributions: { increment: contribution.amount },
            },
        });

        return updated;
    });

    return confirmed;
}
