import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
    try {
        const adminCount = await prisma.admin.count();
        const memberCount = await prisma.member.count();
        const loanCount = await prisma.loan.count();

        console.log(`Admins: ${adminCount}`);
        console.log(`Members: ${memberCount}`);
        console.log(`Loans: ${loanCount}`);

    } catch (e: any) {
        console.error('Verification failed:', e.message);
    } finally {
        await prisma.$disconnect()
    }
}

main()
