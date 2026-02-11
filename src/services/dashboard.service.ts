import { prisma } from "../utils/prisma.js";

export interface DashboardSummary {
  totalMembers: number;
  activeLoans: number;
  totalLoanedAmount: number;
  interestEarned: number;
  penaltiesCollected: number;
  overdueLoans: number;
  clearedLoans: number;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [totalMembers, activeLoansCount, activeLoansAgg, clearedLoansCount, overdueCount, penaltiesAgg] =
    await Promise.all([
      prisma.member.count({ where: { isActive: true } }),
      prisma.loan.count({ where: { status: "ACTIVE" } }),
      prisma.loan.aggregate({
        where: { status: "ACTIVE" },
        _sum: { principalAmount: true },
      }),
      prisma.loan.count({ where: { status: "CLEARED" } }),
      prisma.loan.count({
        where: {
          status: "ACTIVE",
          expectedEndDate: { lt: new Date() },
          remainingBalance: { gt: 0 },
        },
      }),
      prisma.payment.aggregate({
        _sum: { penaltyAmount: true },
      }),
    ]);

  const totalLoanedAmount = Number(activeLoansAgg._sum.principalAmount ?? 0);
  const allLoansInterest = await prisma.loan.aggregate({
    _sum: { interestAmount: true },
  });
  const interestEarned = Number(allLoansInterest._sum.interestAmount ?? 0);
  const penaltiesCollected = Number(penaltiesAgg._sum.penaltyAmount ?? 0);

  return {
    totalMembers,
    activeLoans: activeLoansCount,
    totalLoanedAmount,
    interestEarned,
    penaltiesCollected,
    overdueLoans: overdueCount,
    clearedLoans: clearedLoansCount,
  };
}
