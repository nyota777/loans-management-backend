import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
export declare function login(req: Request, res: Response): Promise<void>;
export declare function me(req: AuthRequest, res: Response): Promise<void>;
export declare function changePassword(req: AuthRequest, res: Response): Promise<void>;
export declare function register(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map