import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const INTEREST_RATE = 12.5;

function calculateLoan(
  principal: number,
  months: number
): { interestAmount: number; totalPayable: number; monthlyInstallment: number } {
  const interestAmount = principal * (INTEREST_RATE / 100) * (months / 12);
  const totalPayable = principal + interestAmount;
  const monthlyInstallment = totalPayable / months;
  return {
    interestAmount: Math.round(interestAmount * 100) / 100,
    totalPayable: Math.round(totalPayable * 100) / 100,
    monthlyInstallment: Math.round(monthlyInstallment * 100) / 100,
  };
}

async function main() {
  const adminHash = await bcrypt.hash("AdminNyota123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@loans.com" },
    update: {
      passwordHash: adminHash,
      phoneNumber: "0722240413",
    },
    create: {
      fullName: "System Admin",
      email: "admin@loans.com",
      phoneNumber: "0722240413",
      passwordHash: adminHash,
      isActive: true,
    },
  });

  const memberIds: string[] = [];
  for (let i = 1; i <= 50; i++) {
    const m = await prisma.member.upsert({
      where: { phoneNumber: `+254700000${String(i).padStart(3, "0")}` },
      update: {},
      create: {
        fullName: `Member ${i}`,
        phoneNumber: `+254700000${String(i).padStart(3, "0")}`,
        idNumber: `ID${String(i).padStart(5, "0")}`,
        totalContributions: Math.round((1000 + Math.random() * 5000) * 100) / 100,
        isActive: true,
      },
    });
    memberIds.push(m.id);
  }

  const loans: { id: string; memberId: string; monthlyInstallment: number; totalPayable: number; remainingBalance: number }[] = [];

  for (let i = 0; i < 15; i++) {
    const memberId = memberIds[i % memberIds.length];
    const principal = Math.round((50000 + Math.random() * 150000) * 100) / 100;
    const months = Math.min(48, 12 + Math.floor(Math.random() * 36));
    const calc = calculateLoan(principal, months);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 6));
    const expectedEndDate = new Date(startDate);
    expectedEndDate.setMonth(expectedEndDate.getMonth() + months);

    const loan = await prisma.loan.create({
      data: {
        memberId,
        principalAmount: principal,
        interestRate: INTEREST_RATE,
        loanDurationMonths: months,
        interestAmount: calc.interestAmount,
        totalPayable: calc.totalPayable,
        monthlyInstallment: calc.monthlyInstallment,
        remainingBalance: calc.totalPayable,
        startDate,
        expectedEndDate,
        status: i < 5 ? "CLEARED" : i < 10 ? "ACTIVE" : "ACTIVE",
        type: i % 5 === 0 ? "EMERGENCY" : "NORMAL", // Add type field
      },
    });
    loans.push({
      id: loan.id,
      memberId: loan.memberId,
      monthlyInstallment: Number(loan.monthlyInstallment),
      totalPayable: Number(loan.totalPayable),
      remainingBalance: Number(loan.remainingBalance),
    });
  }

  for (let i = 0; i < Math.min(8, loans.length); i++) {
    const loan = loans[i];
    const numPayments = 3 + Math.floor(Math.random() * 4);
    let remaining = loan.remainingBalance;
    for (let p = 1; p <= numPayments; p++) {
      const amount = Math.min(
        loan.monthlyInstallment + (Math.random() > 0.7 ? 500 : 0),
        remaining
      );
      remaining = Math.round((remaining - amount) * 100) / 100;
      const paymentDate = new Date();
      paymentDate.setDate(paymentDate.getDate() - (numPayments - p) * 30);
      const isLate = Math.random() > 0.6;
      const penaltyAmount = isLate ? Math.round(amount * 0.05 * 100) / 100 : 0;

      await prisma.payment.create({
        data: {
          loanId: loan.id,
          amountPaid: amount,
          paymentDate,
          remainingBalance: remaining,
          paymentNumber: p,
          isLate,
          penaltyAmount,
          method: Math.random() > 0.5 ? "MPESA" : "CASH", // Add method field
        },
      });
    }

    if (remaining <= 0) {
      await prisma.loan.update({
        where: { id: loan.id },
        data: { status: "CLEARED", remainingBalance: 0 },
      });
    } else {
      await prisma.loan.update({
        where: { id: loan.id },
        data: { remainingBalance: remaining },
      });
    }
  }

  console.log("Seed completed: 1 admin, 50 members, 15 loans, sample payments.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
