import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Connecting to DB...");
    try {
        await prisma.$connect();
        console.log("Successfully connected to DB");
    } catch (e) {
        console.error("Failed to connect to DB:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
