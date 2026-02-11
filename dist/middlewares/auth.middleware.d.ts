import type { Request, Response, NextFunction } from "express";
export interface JwtPayload {
    adminId: string;
    email: string;
}
export interface AuthRequest extends Request {
    admin?: JwtPayload;
}
export declare function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export default authMiddleware;
//# sourceMappingURL=auth.middleware.d.ts.map