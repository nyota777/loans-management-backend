import { Router } from "express";
import { summary } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(authMiddleware);
router.get("/summary", summary);
export default router;
//# sourceMappingURL=dashboard.routes.js.map