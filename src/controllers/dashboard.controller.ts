import type { Request, Response } from "express";
import { getDashboardSummary } from "../services/dashboard.service.js";

export async function summary(req: Request, res: Response): Promise<void> {
  const data = await getDashboardSummary();
  res.status(200).json(data);
}
