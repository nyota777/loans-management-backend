import { prisma } from '../src/utils/prisma.js';

async function main() {
    const admins = await prisma.admin.findMany();
    console.log('Admins in DB:', admins);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
