import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const logFile = 'connection_test_ip.log';
function log(msg: string) {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
}

fs.writeFileSync(logFile, 'Starting IP connection test...\n');

const connectionUrl = process.env.DATABASE_URL;
log(`Using URL: ${connectionUrl?.replace(/:[^:]*@/, ':****@')}`);

const prisma = new PrismaClient({
    datasources: { db: { url: connectionUrl } },
    log: [],
})

async function main() {
    try {
        log('Connecting...');
        await prisma.$connect()
        log('SUCCESS! Connected to IP.');
        await prisma.$disconnect()
    } catch (e: any) {
        log('Connection failed:');
        log(e.message);
        log(`Code: ${e.code}`);
        await prisma.$disconnect()
    }
}

main()
