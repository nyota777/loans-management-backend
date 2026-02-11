import { z } from "zod";
import { createMember, getMembers, getMemberById, updateMember, softDeleteMember, } from "../services/members.service.js";
const createSchema = z.object({
    fullName: z.string().min(1),
    phoneNumber: z.string().min(1),
    idNumber: z.string().min(1),
    totalContributions: z.number().min(0).optional(),
});
const updateSchema = z.object({
    fullName: z.string().min(1).optional(),
    phoneNumber: z.string().min(1).optional(),
    idNumber: z.string().optional().nullable(),
    totalContributions: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
});
export async function create(req, res) {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
        return;
    }
    try {
        const member = await createMember(parsed.data);
        res.status(201).json(member);
    }
    catch (e) {
        const msg = e && typeof e === "object" && "code" in e && e.code === "P2002"
            ? "Phone number already in use"
            : "Failed to create member";
        res.status(400).json({ error: msg });
    }
}
export async function list(req, res) {
    const includeInactive = req.query.includeInactive === "true";
    const members = await getMembers(includeInactive);
    res.status(200).json(members);
}
export async function getById(req, res) {
    const member = await getMemberById(req.params.id);
    if (!member) {
        res.status(404).json({ error: "Member not found" });
        return;
    }
    res.status(200).json(member);
}
export async function update(req, res) {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
        return;
    }
    try {
        const member = await updateMember(req.params.id, {
            ...parsed.data,
            idNumber: parsed.data.idNumber ?? undefined,
        });
        res.status(200).json(member);
    }
    catch (e) {
        const err = e;
        if (err.code === "P2025") {
            res.status(404).json({ error: "Member not found" });
            return;
        }
        if (err.code === "P2002") {
            res.status(400).json({ error: "Phone number already in use" });
            return;
        }
        res.status(500).json({ error: "Failed to update member" });
    }
}
export async function remove(req, res) {
    try {
        const member = await softDeleteMember(req.params.id);
        res.status(200).json(member);
    }
    catch (e) {
        const err = e;
        if (err.code === "P2025") {
            res.status(404).json({ error: "Member not found" });
            return;
        }
        res.status(500).json({ error: "Failed to delete member" });
    }
}
//# sourceMappingURL=members.controller.js.map