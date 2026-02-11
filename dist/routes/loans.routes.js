import { Router } from "express";
import { create, list, getById, getByMemberId, updateStatus, } from "../controllers/loans.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(authMiddleware);
router.post("/", create);
router.get("/", list);
router.get("/member/:memberId", getByMemberId);
router.get("/:id", getById);
router.put("/:id/status", updateStatus);
export default router;
//# sourceMappingURL=loans.routes.js.map