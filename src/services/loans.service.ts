import { prisma } from "../utils/prisma.js";
import { calculateLoan, FIXED_INTEREST_RATE, MAX_LOAN_DURATION_MONTHS } from "../utils/loanCalculator.js";
import { validateFutureDate } from "../utils/date.js";

import { LoanType } from "@prisma/client";

export interface CreateLoanInput {
  memberId: string;
  principalAmount: number;
  loanDurationMonths: number;
  type?: LoanType;
}

export async function createLoan(data: CreateLoanInput) {
  if (data.loanDurationMonths > MAX_LOAN_DURATION_MONTHS) {
    throw new Error(`Loan duration cannot exceed ${MAX_LOAN_DURATION_MONTHS} months`);
  }

  // Emergency Loans have a fixed 5% interest rate
  const interestRate = data.type === LoanType.EMERGENCY ? 5 : FIXED_INTEREST_RATE;

  const calc = calculateLoan(data.principalAmount, data.loanDurationMonths, interestRate);
  const startDate = new Date();
  validateFutureDate(startDate, "Loan start date"); // Technically always today, but good practice if we allow custom start dates later
  const expectedEndDate = new Date(startDate);
  expectedEndDate.setMonth(expectedEndDate.getMonth() + data.loanDurationMonths);

  const loan = await prisma.loan.create({
    data: {
      memberId: data.memberId,
      type: data.type || LoanType.NORMAL,
      principalAmount: data.principalAmount,
      interestRate: interestRate,
      loanDurationMonths: data.loanDurationMonths,
      interestAmount: calc.interestAmount,
      totalPayable: calc.totalPayable,
      monthlyInstallment: calc.monthlyInstallment,
      remainingBalance: calc.totalPayable,
      startDate,
      expectedEndDate,
      status: "ACTIVE",
    },
    include: { member: true },
  });
  return loan;
}

export async function getLoans(status?: string) {
  const where = status ? { status } : {};
  const loans = await prisma.loan.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { member: true },
  });
  return loans;
}

export async function getLoanById(id: string) {
  const loan = await prisma.loan.findUnique({
    where: { id },
    include: { member: true, payments: true },
  });
  return loan;
}

export async function getLoansByMemberId(memberId: string) {
  const loans = await prisma.loan.findMany({
    where: { memberId },
    orderBy: { createdAt: "desc" },
    include: { payments: true },
  });
  return loans;
}

export async function updateLoanStatus(id: string, status: string) {
  const loan = await prisma.loan.update({
    where: { id },
    data: { status },
    include: { member: true },
  });
  return loan;
}
