import { Router } from "express";
import { create, list, confirm } from "../controllers/contributions.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authMiddleware);

router.post("/", create);
router.get("/", list);
router.patch("/:id/confirm", confirm);

export default router;
