import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const logFile = 'connection_test_dns.log';
function log(msg: string) {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
}

fs.writeFileSync(logFile, 'Starting multi-cloud region check...\n');

const PASS = 'Finalfinal%402025';
const PROJ = 'iyyjiaunmgxfvdiwzdou';

// Common regions + GCP specific names if different
const regions = [
    'eu-west-2',    // London - Likely candidate
    'eu-central-1', // Frankfurt
    'eu-west-1',    // Ireland
    'eu-west-3',    // Paris
    'eu-north-1',   // Stockholm
    'eu-central-2', // Zurich
    'us-east-1',    // N. Virginia
];

const prefixes = ['aws-0', 'gcp-0'];

async function testConnection(url: string, label: string) {
    log(`Testing: ${label} ...`);
    const prisma = new PrismaClient({
        datasources: { db: { url } },
        log: [],
    });

    try {
        // Set a promise timeout of 5s to fail faster
        const connect = prisma.$connect();
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000));

        await Promise.race([connect, timeout]);

        log(`SUCCESS! ${label} works.`);
        await prisma.$disconnect();
        return true;
    } catch (e: any) {
        const msg = e.message.split('\n').find((l: string) => l.includes('FATAL') || l.includes('Can\'t reach')) || e.message.substring(0, 100);
        log(`Failed ${label}: ${msg.trim()}`);
        await prisma.$disconnect();
        return false;
    }
}

async function main() {
    for (const region of regions) {
        for (const prefix of prefixes) {
            // Try Transaction Pooler (6543)
            const url = `postgres://postgres.${PROJ}:${PASS}@${prefix}-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`;

            if (await testConnection(url, `${prefix}-${region}`)) {
                log(`\nFOUND CORRECT URL: ${url}`);
                fs.writeFileSync('correct_url.txt', url);
                process.exit(0);
            }
        }
    }
    log('All regions failed.');
    process.exit(1);
}

main()
