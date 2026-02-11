import { Router } from "express";
import { login, me, changePassword, register } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/change-password", authMiddleware, changePassword);
router.post("/register", register);
export default router;
//# sourceMappingURL=auth.routes.js.map