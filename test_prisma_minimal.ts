import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const logFile = 'connection_test_minimal.log';
function log(msg: string) {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
}

fs.writeFileSync(logFile, 'Starting Minimal test...\n');

// Hardcoded URL - bypasses .env issues
// User: postgres.uvzisyaxdmdopxghxkid
// Pass: Shiru%26allan%402025 (URL encoded)
// Host: 34.117.176.2
// Port: 5432
// Params: sslaccept=accept_invalid_certs (NO pgbouncer)

const url = "postgresql://postgres.uvzisyaxdmdopxghxkid:Shiru%26allan%402025@34.117.176.2:5432/postgres?sslaccept=accept_invalid_certs";

log(`Using hardcoded URL: ${url.replace(/:[^:]*@/, ':****@')}`);

const prisma = new PrismaClient({
    datasources: { db: { url } },
    log: ['info', 'warn', 'error'], // Enable prisma logging to see internal errors
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
        await prisma.$disconnect()
    }
}

main()
