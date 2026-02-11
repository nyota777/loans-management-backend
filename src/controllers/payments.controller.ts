import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { z } from "zod";
import {
  createPayment,
  confirmPayment,
  getPaymentsByLoanId,
  getPaymentsByMemberId,
  getAllPayments,
} from "../services/payments.service.js";
import { PaymentMethod } from "@prisma/client";

const createSchema = z.object({
  loanId: z.string().uuid(),
  amountPaid: z.number().positive(),
  paymentDate: z.coerce.date(),
  method: z.nativeEnum(PaymentMethod),
  referenceCode: z.string().optional(),
});

const confirmSchema = z.object({
  referenceCode: z.string().optional(),
});

export async function create(req: Request, res: Response): Promise<void> {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  try {
    const payment = await createPayment(parsed.data);
    res.status(201).json(payment);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to record payment";
    const code = msg.includes("not found")
      ? 404
      : msg.includes("overpayment") || msg.includes("cleared") || msg.includes("positive") || msg.includes("past")
        ? 400
        : 500;
    res.status(code).json({ error: msg });
  }
}

export async function confirm(req: Request, res: Response): Promise<void> {
  const parsed = confirmSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }

  const adminId = (req as AuthRequest).admin?.adminId;

  if (!adminId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const payment = await confirmPayment(req.params.id, adminId, parsed.data.referenceCode);
    res.status(200).json(payment);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to confirm payment";
    const code = msg.includes("not found")
      ? 404
      : msg.includes("confirmed") || msg.includes("required") || msg.includes("used")
        ? 400
        : 500;
    res.status(code).json({ error: msg });
  }
}

export async function getByLoanId(req: Request, res: Response): Promise<void> {
  const payments = await getPaymentsByLoanId(req.params.loanId);
  res.status(200).json(payments);
}

export async function getByMemberId(req: Request, res: Response): Promise<void> {
  const payments = await getPaymentsByMemberId(req.params.memberId);
  res.status(200).json(payments);
}

export async function listAll(req: Request, res: Response): Promise<void> {
  const payments = await getAllPayments();
  res.status(200).json(payments);
}
