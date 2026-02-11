import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma.js";
import { env } from "../config/env.js";
import type { JwtPayload } from "../middlewares/auth.middleware.js";

export interface LoginInput {
  phoneNumber: string;
  password: string;
}

export interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: Date;
}

export async function validateAdmin(phoneNumber: string, password: string): Promise<AdminProfile | null> {
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

export interface CreateAdminInput {
  fullName: string;
  email: string;
  phoneNumber: string;
  passwordHash: string;
}

export async function createAdmin(data: CreateAdminInput): Promise<AdminProfile> {
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

export function createToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
}

export async function getAdminById(adminId: string): Promise<AdminProfile | null> {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId, isActive: true },
  });
  if (!admin) return null;
  return {
    id: admin.id,
    fullName: admin.fullName,
    email: admin.email,
    phoneNumber: admin.phoneNumber,
    isActive: admin.isActive,
    createdAt: admin.createdAt,
  };
}
