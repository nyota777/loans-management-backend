import { prisma } from "../utils/prisma.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Missing or invalid authorization header" });
        return;
    }
    const token = authHeader.slice(7);
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        // Safety check: Ensure admin still exists (e.g. if DB was reset)
        const admin = await prisma.admin.findUnique({ where: { id: decoded.adminId } });
        if (!admin) {
            res.status(401).json({ error: "Admin account no longer exists. Please login again." });
            return;
        }
        req.admin = decoded;
        next();
    }
    catch {
        res.status(401).json({ error: "Invalid or expired token" });
    }
}
export default authMiddleware;
//# sourceMappingURL=auth.middleware.js.map