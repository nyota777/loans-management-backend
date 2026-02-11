import { prisma } from "../utils/prisma.js";
export async function createMember(data) {
    const member = await prisma.member.create({
        data: {
            fullName: data.fullName.trim(),
            phoneNumber: data.phoneNumber.trim(),
            idNumber: data.idNumber.trim(),
            totalContributions: data.totalContributions ?? 0,
            isActive: true,
        },
    });
    return member;
}
export async function getMembers(includeInactive = false) {
    const where = {};
    if (!includeInactive) {
        where.isActive = true;
    }
    const members = await prisma.member.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { loans: true } } },
    });
    return members;
}
export async function getMemberById(id) {
    const member = await prisma.member.findFirst({
        where: { id },
        include: { loans: true },
    });
    return member;
}
export async function updateMember(id, data) {
    const member = await prisma.member.update({
        where: { id },
        data: {
            ...(data.fullName !== undefined && { fullName: data.fullName.trim() }),
            ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber.trim() }),
            ...(data.idNumber !== undefined && { idNumber: data.idNumber?.trim() ?? "" }), // handle empty string if needed, or ensure not null
            ...(data.totalContributions !== undefined && { totalContributions: data.totalContributions }),
            ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
    });
    return member;
}
export async function softDeleteMember(id) {
    const member = await prisma.member.update({
        where: { id },
        data: { isActive: false },
    });
    return member;
}
//# sourceMappingURL=members.service.js.map