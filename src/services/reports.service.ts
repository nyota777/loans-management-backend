import { prisma } from "../utils/prisma.js";

export async function getLoansReport() {
  const loans = await prisma.loan.findMany({
    orderBy: { createdAt: "desc" },
    include: { member: true },
  });
  return loans.map((l) => ({
    id: l.id,
    memberId: l.memberId,
    memberName: l.member.fullName,
    phoneNumber: l.member.phoneNumber,
    principalAmount: Number(l.principalAmount),
    interestRate: Number(l.interestRate),
    loanDurationMonths: l.loanDurationMonths,
    interestAmount: Number(l.interestAmount),
    totalPayable: Number(l.totalPayable),
    monthlyInstallment: Number(l.monthlyInstallment),
    remainingBalance: Number(l.remainingBalance),
    startDate: l.startDate,
    expectedEndDate: l.expectedEndDate,
    status: l.status,
    createdAt: l.createdAt,
  }));
}

export async function getPaymentsReport() {
  const payments = await prisma.payment.findMany({
    orderBy: { paymentDate: "desc" },
    include: { loan: { include: { member: true } } },
  });
  return payments.map((p) => ({
    id: p.id,
    loanId: p.loanId,
    memberId: p.loan.memberId,
    memberName: p.loan.member.fullName,
    amountPaid: Number(p.amountPaid),
    paymentDate: p.paymentDate,
    remainingBalance: Number(p.remainingBalance),
    paymentNumber: p.paymentNumber,
    isLate: p.isLate,
    penaltyAmount: Number(p.penaltyAmount),
    createdAt: p.createdAt,
  }));
}

export async function getOverdueLoansReport() {
  const loans = await prisma.loan.findMany({
    where: {
      status: "ACTIVE",
      expectedEndDate: { lt: new Date() },
      remainingBalance: { gt: 0 },
    },
    orderBy: { expectedEndDate: "asc" },
    include: { member: true },
  });
  return loans.map((l) => ({
    id: l.id,
    memberId: l.memberId,
    memberName: l.member.fullName,
    phoneNumber: l.member.phoneNumber,
    principalAmount: Number(l.principalAmount),
    remainingBalance: Number(l.remainingBalance),
    monthlyInstallment: Number(l.monthlyInstallment),
    expectedEndDate: l.expectedEndDate,
    startDate: l.startDate,
    status: l.status,
  }));
}

export async function getMemberLoanHistory(memberId: string) {
  const loans = await prisma.loan.findMany({
    where: { memberId },
    orderBy: { createdAt: "desc" },
    include: { payments: true, member: true },
  });
  return loans.map((l) => ({
    id: l.id,
    memberId: l.memberId,
    memberName: l.member.fullName,
    principalAmount: Number(l.principalAmount),
    interestAmount: Number(l.interestAmount),
    totalPayable: Number(l.totalPayable),
    remainingBalance: Number(l.remainingBalance),
    monthlyInstallment: Number(l.monthlyInstallment),
    startDate: l.startDate,
    expectedEndDate: l.expectedEndDate,
    status: l.status,
    payments: l.payments.map((p) => ({
      id: p.id,
      amountPaid: Number(p.amountPaid),
      paymentDate: p.paymentDate,
      paymentNumber: p.paymentNumber,
      isLate: p.isLate,
      penaltyAmount: Number(p.penaltyAmount),
    })),
    createdAt: l.createdAt,
  }));
}
