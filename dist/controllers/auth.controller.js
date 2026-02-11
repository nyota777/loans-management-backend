import { z } from "zod";
import { validateAdmin, createToken, getAdminById } from "../services/auth.service.js";
import { prisma } from "../utils/prisma.js";
import bcrypt from "bcrypt";
const loginSchema = z.object({
    phoneNumber: z.string().min(10),
    password: z.string().min(1),
});
export async function login(req, res) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
        return;
    }
    const { phoneNumber, password } = parsed.data;
    const admin = await validateAdmin(phoneNumber, password);
    if (!admin) {
        res.status(401).json({ error: "Invalid phone number or password" });
        return;
    }
    const token = createToken({ adminId: admin.id, email: admin.email }); // Keep email in token for now or switch to phone if needed
    res.status(200).json({
        token,
        admin: {
            id: admin.id,
            fullName: admin.fullName,
            email: admin.email,
            phoneNumber: admin.phoneNumber,
            isActive: admin.isActive,
        },
    });
}
export async function me(req, res) {
    if (!req.admin) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const admin = await getAdminById(req.admin.adminId);
    if (!admin) {
        res.status(401).json({ error: "Admin not found or inactive" });
        return;
    }
    res.status(200).json({
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
    });
}
const changePasswordSchema = z.object({
    oldPassword: z.string().min(1),
    newPassword: z.string().min(6),
});
export async function changePassword(req, res) {
    if (!req.admin) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
        return;
    }
    const { oldPassword, newPassword } = parsed.data;
    // We need to fetch the admin's password hash to compare
    const admin = await prisma.admin.findUnique({
        where: { id: req.admin.adminId },
    });
    if (!admin) {
        res.status(404).json({ error: "Admin not found" });
        return;
    }
    const valid = await bcrypt.compare(oldPassword, admin.passwordHash);
    if (!valid) {
        res.status(400).json({ error: "Incorrect old password" });
        return;
    }
    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
        where: { id: admin.id },
        data: { passwordHash: newHash },
    });
    res.status(200).json({ message: "Password updated successfully" });
}
const registerSchema = z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    phoneNumber: z.string().min(10),
    password: z.string().min(8),
});
export async function register(req, res) {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
        return;
    }
    const { fullName, email, phoneNumber, password } = parsed.data;
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst({
        where: {
            OR: [{ email }, { phoneNumber }],
        },
    });
    if (existingAdmin) {
        res.status(400).json({ error: "Admin with this email or phone number already exists" });
        return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    // We need to import createAdmin but since I can't easily add import to top in same step without viewing again, 
    // I will just use prisma directly here or assume I'll fix imports. 
    // Actually, better to use the service function I just added.
    // Wait, I need to export createAdmin from service first.
    // Let's assume I'm adding `createAdmin` to imports in a separate step or just use prisma here directly to be safe?
    // No, I added `createAdmin` to service. I should import it. 
    // I will add the import line in a separate step.
    const admin = await prisma.admin.create({
        data: {
            fullName,
            email,
            phoneNumber,
            passwordHash,
            isActive: true
        }
    });
    // Generate token for immediate login
    const token = createToken({ adminId: admin.id, email: admin.email });
    res.status(201).json({
        token,
        admin: {
            id: admin.id,
            fullName: admin.fullName,
            email: admin.email,
            phoneNumber: admin.phoneNumber,
            isActive: admin.isActive,
        },
    });
}
//# sourceMappingURL=auth.controller.js.map