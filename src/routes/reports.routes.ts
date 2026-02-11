import { Router } from "express";
import {
  loansReport,
  paymentsReport,
  overdueReport,
  memberLoanHistory,
} from "../controllers/reports.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/loans", loansReport);
router.get("/payments", paymentsReport);
router.get("/overdue", overdueReport);
router.get("/member/:memberId/loan-history", memberLoanHistory);

export default router;
