import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const adminHash = await bcrypt.hash("AdminNyota123", 10);
    const admin = await prisma.admin.upsert({
        where: { email: "admin@loans.com" },
        update: {
            passwordHash: adminHash,
            phoneNumber: "0722240413", // Ensure phone is correct
            isActive: true
        },
        create: {
            fullName: "System Admin",
            email: "admin@loans.com",
            phoneNumber: "0722240413",
            passwordHash: adminHash,
            isActive: true,
        },
    });
    console.log("Admin restored with ID:", admin.id);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
