import { getDashboardSummary } from "../services/dashboard.service.js";
export async function summary(req, res) {
    const data = await getDashboardSummary();
    res.status(200).json(data);
}
//# sourceMappingURL=dashboard.controller.js.map