/*
  Warnings:

  - You are about to drop the column `createdAt` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `loans` table. All the data in the column will be lost.
  - You are about to alter the column `principalAmount` on the `loans` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `DoublePrecision`.
  - You are about to alter the column `interestRate` on the `loans` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `DoublePrecision`.
  - You are about to alter the column `interestAmount` on the `loans` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `DoublePrecision`.
  - You are about to alter the column `totalPayable` on the `loans` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `DoublePrecision`.
  - You are about to alter the column `monthlyInstallment` on the `loans` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `DoublePrecision`.
  - You are about to alter the column `remainingBalance` on the `loans` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `DoublePrecision`.
  - You are about to drop the column `createdAt` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `members` table. All the data in the column will be lost.
  - You are about to alter the column `totalContributions` on the `members` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `DoublePrecision`.
  - You are about to drop the column `createdAt` on the `payments` table. All the data in the column will be lost.
  - You are about to alter the column `amountPaid` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `DoublePrecision`.
  - You are about to alter the column `remainingBalance` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `DoublePrecision`.
  - You are about to alter the column `penaltyAmount` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `DoublePrecision`.
  - A unique constraint covering the columns `[phoneNumber]` on the table `admins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idNumber]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[referenceCode]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `is_active` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `loans` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `is_active` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `members` table without a default value. This is not possible if the table is not empty.
  - Made the column `idNumber` on table `members` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `method` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LoanType" AS ENUM ('NORMAL', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('MPESA', 'CASH', 'BANK');

-- DropIndex
DROP INDEX "loans_memberId_idx";

-- DropIndex
DROP INDEX "loans_status_idx";

-- DropIndex
DROP INDEX "payments_loanId_idx";

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "createdAt",
DROP COLUMN "isActive",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_active" BOOLEAN NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "loans" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "type" "LoanType" NOT NULL DEFAULT 'NORMAL',
ALTER COLUMN "principalAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "interestRate" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "interestAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "totalPayable" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "monthlyInstallment" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "remainingBalance" SET DATA TYPE DOUBLE PRECISION,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "members" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "isActive",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_active" BOOLEAN NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "idNumber" SET NOT NULL,
ALTER COLUMN "totalContributions" DROP DEFAULT,
ALTER COLUMN "totalContributions" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "createdAt",
ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "confirmedByAdminId" TEXT,
ADD COLUMN     "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "method" "PaymentMethod" NOT NULL,
ADD COLUMN     "referenceCode" TEXT,
ALTER COLUMN "amountPaid" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "remainingBalance" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "isLate" DROP DEFAULT,
ALTER COLUMN "penaltyAmount" DROP DEFAULT,
ALTER COLUMN "penaltyAmount" SET DATA TYPE DOUBLE PRECISION;

-- DropEnum
DROP TYPE "LoanStatus";

-- CreateTable
CREATE TABLE "contributions" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "referenceCode" TEXT,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmedAt" TIMESTAMP(3),
    "confirmedByAdminId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contributions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contributions_referenceCode_key" ON "contributions"("referenceCode");

-- CreateIndex
CREATE UNIQUE INDEX "admins_phoneNumber_key" ON "admins"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "members_idNumber_key" ON "members"("idNumber");

-- CreateIndex
CREATE UNIQUE INDEX "payments_referenceCode_key" ON "payments"("referenceCode");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_confirmedByAdminId_fkey" FOREIGN KEY ("confirmedByAdminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_confirmedByAdminId_fkey" FOREIGN KEY ("confirmedByAdminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
