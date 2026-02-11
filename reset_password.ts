import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const phoneNumber = "0722240413";
    const password = "AdminNyota123";

    console.log(`Resetting password for: ${phoneNumber}`);
    const hash = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.update({
        where: { phoneNumber },
        data: { passwordHash: hash },
    });

    console.log(`Password updated. New hash: ${admin.passwordHash}`);

    // Verify immediately
    const match = await bcrypt.compare(password, admin.passwordHash);
    console.log(`Immediate verification: ${match}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
