import type { Request, Response } from "express";
import {
  getLoansReport,
  getPaymentsReport,
  getOverdueLoansReport,
  getMemberLoanHistory,
} from "../services/reports.service.js";
import { exportToCsv, toCsvSafeRow } from "../utils/csvExporter.js";

function sendReport(res: Response, data: Record<string, unknown>[], format: string | undefined): void {
  if (format === "csv") {
    const safe = data.map((row) => toCsvSafeRow(row));
    const csv = exportToCsv(safe);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=report.csv");
    res.status(200).send(csv);
  } else {
    res.status(200).json(data);
  }
}

export async function loansReport(req: Request, res: Response): Promise<void> {
  const data = await getLoansReport();
  const format = req.query.format as string | undefined;
  sendReport(res, data as Record<string, unknown>[], format);
}

export async function paymentsReport(req: Request, res: Response): Promise<void> {
  const data = await getPaymentsReport();
  const format = req.query.format as string | undefined;
  sendReport(res, data as Record<string, unknown>[], format);
}

export async function overdueReport(req: Request, res: Response): Promise<void> {
  const data = await getOverdueLoansReport();
  const format = req.query.format as string | undefined;
  sendReport(res, data as Record<string, unknown>[], format);
}

export async function memberLoanHistory(req: Request, res: Response): Promise<void> {
  const data = await getMemberLoanHistory(req.params.memberId);
  const format = req.query.format as string | undefined;
  if (format === "csv") {
    const flattened: Record<string, unknown>[] = [];
    for (const loan of data) {
      const { payments, ...rest } = loan;
      flattened.push(toCsvSafeRow({ ...rest, paymentCount: payments.length }));
    }
    const csv = exportToCsv(flattened);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=member-loan-history.csv");
    res.status(200).send(csv);
  } else {
    res.status(200).json(data);
  }
}
