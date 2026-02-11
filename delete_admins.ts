import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Deleting all admins...");
    const { count } = await prisma.admin.deleteMany({});
    console.log(`Deleted ${count} admins.`);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
