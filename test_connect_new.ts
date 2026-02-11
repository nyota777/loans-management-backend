import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const logFile = 'connection_test_new.log';
function log(msg: string) {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
}

fs.writeFileSync(logFile, 'Starting New Project test...\n');

// New credentials
const url = "postgresql://postgres:Finalfinal%402025@db.iyyjiaunmgxfvdiwzdou.supabase.co:5432/postgres?sslaccept=accept_invalid_certs";

log(`Using URL: ${url.replace(/:[^:]*@/, ':****@')}`);

const prisma = new PrismaClient({
    datasources: { db: { url } },
    log: ['info', 'warn', 'error'],
})

async function main() {
    try {
        log('Connecting...');
        await prisma.$connect()
        log('SUCCESS!');
        await prisma.$disconnect()
    } catch (e: any) {
        log('Failed:');
        log(e.message);
        log(`Code: ${e.code}`);
        await prisma.$disconnect()
    }
}

main()
