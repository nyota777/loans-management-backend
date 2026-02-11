import { getLoansReport, getPaymentsReport, getOverdueLoansReport, getMemberLoanHistory, } from "../services/reports.service.js";
import { exportToCsv, toCsvSafeRow } from "../utils/csvExporter.js";
function sendReport(res, data, format) {
    if (format === "csv") {
        const safe = data.map((row) => toCsvSafeRow(row));
        const csv = exportToCsv(safe);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=report.csv");
        res.status(200).send(csv);
    }
    else {
        res.status(200).json(data);
    }
}
export async function loansReport(req, res) {
    const data = await getLoansReport();
    const format = req.query.format;
    sendReport(res, data, format);
}
export async function paymentsReport(req, res) {
    const data = await getPaymentsReport();
    const format = req.query.format;
    sendReport(res, data, format);
}
export async function overdueReport(req, res) {
    const data = await getOverdueLoansReport();
    const format = req.query.format;
    sendReport(res, data, format);
}
export async function memberLoanHistory(req, res) {
    const data = await getMemberLoanHistory(req.params.memberId);
    const format = req.query.format;
    if (format === "csv") {
        const flattened = [];
        for (const loan of data) {
            const { payments, ...rest } = loan;
            flattened.push(toCsvSafeRow({ ...rest, paymentCount: payments.length }));
        }
        const csv = exportToCsv(flattened);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=member-loan-history.csv");
        res.status(200).send(csv);
    }
    else {
        res.status(200).json(data);
    }
}
//# sourceMappingURL=reports.controller.js.map