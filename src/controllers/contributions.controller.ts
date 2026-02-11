import type { Request, Response } from "express";
import { z } from "zod";
import { PaymentMethod } from "@prisma/client";
import {
    createContribution,
    getContributions,
    confirmContribution,
} from "../services/contributions.service.js";

const createSchema = z.object({
    memberId: z.string().uuid(),
    amount: z.number().positive(),
    date: z.coerce.date(),
    method: z.nativeEnum(PaymentMethod),
    referenceCode: z.string().optional(),
});

export async function create(req: Request, res: Response): Promise<void> {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
        return;
    }
    try {
        const contribution = await createContribution(parsed.data);
        res.status(201).json(contribution);
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to record contribution";
        const code = msg.includes("not found") ? 404 : 400; // mostly validation errors or member not found
        res.status(code).json({ error: msg });
    }
}

export async function list(req: Request, res: Response): Promise<void> {
    const memberId = typeof req.query.memberId === "string" ? req.query.memberId : undefined;
    const contributions = await getContributions(memberId);
    res.status(200).json(contributions);
}

import { AuthRequest } from "../middlewares/auth.middleware.js";

export async function confirm(req: Request, res: Response): Promise<void> {
    const adminId = (req as AuthRequest).admin?.adminId;
    if (!adminId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        const contribution = await confirmContribution(req.params.id, adminId);
        res.status(200).json(contribution);
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to confirm contribution";
        const code = msg.includes("not found") ? 404 : 400;
        res.status(code).json({ error: msg });
    }
}
