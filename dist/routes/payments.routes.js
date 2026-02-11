import { Router } from "express";
import { create, getByLoanId, getByMemberId, confirm, listAll } from "../controllers/payments.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(authMiddleware);
router.post("/", create);
router.get("/", listAll);
router.get("/loan/:loanId", getByLoanId);
router.get("/member/:memberId", getByMemberId);
router.patch("/:id/confirm", confirm);
export default router;
//# sourceMappingURL=payments.routes.js.map