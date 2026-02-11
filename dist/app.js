import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import membersRoutes from "./routes/members.routes.js";
import loansRoutes from "./routes/loans.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";
import contributionsRoutes from "./routes/contributions.routes.js";
import reportsRoutes from "./routes/reports.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/members", membersRoutes);
app.use("/loans", loansRoutes);
app.use("/payments", paymentsRoutes);
app.use("/contributions", contributionsRoutes);
app.use("/reports", reportsRoutes);
app.use("/dashboard", dashboardRoutes);
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});
export default app;
//# sourceMappingURL=app.js.map