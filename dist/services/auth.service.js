import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma.js";
import { env } from "../config/env.js";
export async function validateAdmin(phoneNumber, password) {
    const admin = await prisma.admin.findUnique({
        where: { phoneNumber: phoneNumber.trim() },
    });
    if (!admin || !admin.isActive) {
        return null;
    }
    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
        return null;
    }
    return {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
    };
}
export async function createAdmin(data) {
    const admin = await prisma.admin.create({
        data: {
            ...data,
            isActive: true,
        },
    });
    return {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
    };
}
export function createToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}
export async function getAdminById(adminId) {
    const admin = await prisma.admin.findUnique({
        where: { id: adminId, isActive: true },
    });
    if (!admin)
        return null;
    return {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
    };
}
//# sourceMappingURL=auth.service.js.map