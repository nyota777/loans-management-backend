import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
    const phoneNumber = "0722240413";
    const password = "AdminNyota123";

    let result = "";

    const admin = await prisma.admin.findUnique({
        where: { phoneNumber },
    });

    if (!admin) {
        result += "Admin NOT found in DB\n";
    } else {
        result += `Admin found: ${admin.email}, ${admin.phoneNumber}\n`;
        result += `Stored Hash: ${admin.passwordHash}\n`;

        const match = await bcrypt.compare(password, admin.passwordHash);
        result += `Password '${password}' match result: ${match}\n`;

        const newHash = await bcrypt.hash(password, 10);
        result += `New Hash would be: ${newHash}\n`;
    }

    fs.writeFileSync("hash_result.txt", result, "utf8");
    console.log("Done writing to hash_result.txt");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
