import type { Request, Response } from "express";
import { z } from "zod";
import {
  createLoan,
  getLoans,
  getLoanById,
  getLoansByMemberId,
  updateLoanStatus,
} from "../services/loans.service.js";
import { LoanType } from "@prisma/client";

const createSchema = z.object({
  memberId: z.string().uuid(),
  principalAmount: z.number().positive(),
  loanDurationMonths: z.number().int().min(1).max(48),
  type: z.nativeEnum(LoanType).optional(),
});

const statusSchema = z.enum(["ACTIVE", "CLEARED", "DEFAULTED"]);

export async function create(req: Request, res: Response): Promise<void> {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  try {
    const loan = await createLoan(parsed.data);
    res.status(201).json(loan);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create loan";
    res.status(400).json({ error: msg });
  }
}

export async function list(req: Request, res: Response): Promise<void> {
  const status = req.query.status as string | undefined;
  if (status && !["ACTIVE", "CLEARED", "DEFAULTED"].includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }
  const loans = await getLoans(status);
  res.status(200).json(loans);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const loan = await getLoanById(req.params.id);
  if (!loan) {
    res.status(404).json({ error: "Loan not found" });
    return;
  }
  res.status(200).json(loan);
}

export async function getByMemberId(req: Request, res: Response): Promise<void> {
  const loans = await getLoansByMemberId(req.params.memberId);
  res.status(200).json(loans);
}

export async function updateStatus(req: Request, res: Response): Promise<void> {
  const parsed = statusSchema.safeParse(req.body.status ?? req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid status", details: parsed.error.flatten() });
    return;
  }
  try {
    const loan = await updateLoanStatus(req.params.id, parsed.data);
    res.status(200).json(loan);
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === "P2025") {
      res.status(404).json({ error: "Loan not found" });
      return;
    }
    res.status(500).json({ error: "Failed to update loan status" });
  }
}
