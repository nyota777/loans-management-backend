
import { prisma } from "../utils/prisma.js";
import { calculateLatePenalty } from "../utils/loanCalculator.js";
import { env } from "../config/env.js";
import { PaymentMethod } from "@prisma/client";
import { validateFutureDate } from "../utils/date.js";

export interface CreatePaymentInput {
  loanId: string;
  amountPaid: number;
  paymentDate: string | Date;
  method: PaymentMethod;
  referenceCode?: string;
}

function getDueDateForInstallment(loanStartDate: Date, installmentNumber: number): Date {
  const d = new Date(loanStartDate);
  d.setMonth(d.getMonth() + installmentNumber);
  return d;
}

export async function createPayment(data: CreatePaymentInput) {
  validateFutureDate(data.paymentDate, "Payment date");

  const loan = await prisma.loan.findUnique({
    where: { id: data.loanId },
  });
  if (!loan) {
    throw new Error("Loan not found");
  }
  if (loan.status === "CLEARED") {
    throw new Error("Loan is already cleared");
  }

  if (data.amountPaid <= 0) {
    throw new Error("Amount must be positive");
  }

  if (data.method === "MPESA" && !data.referenceCode) { // Usually optional at creation, but let's enforce if user provides it
    // User requirement: "referenceCode is optional at creation"
    // So detailed validation happens at confirmation usually, but if provided it must be unique.
  }

  if (data.referenceCode) {
    const existing = await prisma.payment.findUnique({
      where: { referenceCode: data.referenceCode },
    });
    if (existing) {
      throw new Error(`Reference code ${data.referenceCode} already used`);
    }
  }

  // Create PENDING payment. Do NOT update loan balance yet.
  // We need to calculate what the payment number *would* be, but strictly speaking,
  // until confirmed, it's just a record. 
  // However, for the UI to show "Payment #X", we might look at existing *confirmed* payments + 1.
  // But if there are multiple pending, it gets tricky. 
  // Simplification: Assign paymentNumber based on current count of defaults.
  // Actually, we should probably calculate `isLate` and `penalty` tentatively, but apply them on confirm.
  // For now, let's store them as tentative.

  const currentPaymentsCount = await prisma.payment.count({ where: { loanId: data.loanId } });
  const paymentNumber = currentPaymentsCount + 1;
  const dueDate = getDueDateForInstallment(loan.startDate, paymentNumber);
  const isLate = new Date(data.paymentDate) > dueDate;
  const penaltyAmount = isLate
    ? calculateLatePenalty(Number(loan.monthlyInstallment), env.LATE_PENALTY_PERCENT)
    : 0;

  // Remaining balance in Payment record is snapshot-in-time. 
  // Since we haven't deducted it yet, maybe we shouldn't store it? 
  // Schema has `remainingBalance` as required Float. 
  // We can store the *current* remaining balance (before deduction) or calculated after.
  // User says: "Loan remaining balance updates ONLY after confirmation".
  // Let's store expected remaining balance.

  const currentRemaining = Number(loan.remainingBalance);
  // Note: If multiple pending payments exist, this might be inaccurate, but that's a known race condition in pending-ledger systems.
  // We will re-calculate on confirmation.

  const payment = await prisma.payment.create({
    data: {
      loanId: data.loanId,
      amountPaid: data.amountPaid,
      paymentDate: new Date(data.paymentDate),
      method: data.method,
      referenceCode: data.referenceCode,
      isConfirmed: false,

      // Tentative values
      paymentNumber,
      remainingBalance: currentRemaining, // Don't deduct yet
      isLate,
      penaltyAmount,
    },
  });

  return payment;
}

export async function confirmPayment(id: string, adminId: string, referenceCode?: string) {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { loan: { include: { payments: true } } },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }
  if (payment.isConfirmed) {
    throw new Error("Payment is already confirmed");
  }

  // Update reference code if provided (e.g. was empty initially)
  const finalRefCode = referenceCode || payment.referenceCode;
  if (payment.method === "MPESA" && !finalRefCode) {
    throw new Error("M-Pesa payments require a reference code for confirmation");
  }

  // Check uniqueness if specifically setting/changing it
  if (finalRefCode && finalRefCode !== payment.referenceCode) {
    const existing = await prisma.payment.findUnique({ where: { referenceCode: finalRefCode } });
    if (existing) throw new Error("Reference code already used");
  }

  // RE-CALCULATE logic to ensure consistency at confirmation time
  const loan = payment.loan;
  const currentRemaining = Number(loan.remainingBalance);

  // Re-eval late status based on *confirmed* ordering? 
  // For simplicity, we keep the tentative `isLate` / `penalty` calculated at creation 
  // UNLESS the paymentDate was edited (which we don't support editing date yet).
  // But we MUST calculate the new Loan Balance here.

  const newLoanBalance = Math.round((currentRemaining - payment.amountPaid + payment.penaltyAmount) * 100) / 100;
  const newStatus = newLoanBalance <= 0 ? "CLEARED" : loan.status;

  const [confirmedPayment] = await prisma.$transaction([
    prisma.payment.update({
      where: { id },
      data: {
        isConfirmed: true,
        confirmedAt: new Date(),
        confirmedByAdminId: adminId,
        referenceCode: finalRefCode,
        remainingBalance: newLoanBalance, // Update snapshot to reflect post-payment reality
      },
      include: { loan: true }, // Return loan with it
    }),
    prisma.loan.update({
      where: { id: payment.loanId },
      data: {
        remainingBalance: newLoanBalance,
        status: newStatus,
      },
    }),
  ]);

  return confirmedPayment;
}

export async function getPaymentsByLoanId(loanId: string) {
  const payments = await prisma.payment.findMany({
    where: { loanId },
    orderBy: { paymentNumber: "asc" },
  });
  return payments;
}

export async function getPaymentsByMemberId(memberId: string) {
  const payments = await prisma.payment.findMany({
    where: { loan: { memberId } },
    include: { loan: true },
    orderBy: { paymentDate: "desc" },
  });
  return payments;
}

export async function getAllPayments() {
  return prisma.payment.findMany({
    orderBy: { paymentDate: "desc" },
    include: { loan: { include: { member: true } } }
  });
}

