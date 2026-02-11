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
export declare function validateAdmin(phoneNumber: string, password: string): Promise<AdminProfile | null>;
export interface CreateAdminInput {
    fullName: string;
    email: string;
    phoneNumber: string;
    passwordHash: string;
}
export declare function createAdmin(data: CreateAdminInput): Promise<AdminProfile>;
export declare function createToken(payload: JwtPayload): string;
export declare function getAdminById(adminId: string): Promise<AdminProfile | null>;
//# sourceMappingURL=auth.service.d.ts.map