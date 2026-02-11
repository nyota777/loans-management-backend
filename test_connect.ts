import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const logFile = 'connection_test.log';
function log(msg: string) {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
}

fs.writeFileSync(logFile, 'Starting multi-region check...\n');

// Password and Project ID from user
const PASS = 'Shiru%26allan%402025';
const PROJ = 'uvzisyaxdmdopxghxkid';

// Candidates for Session Pooler (Port 5432)
// User must be: postgres.[project-ref]
const regions = [
    'eu-central-1', // Frankfurt
    'eu-west-1',    // Ireland
    'eu-west-2',    // London
    'eu-west-3',    // Paris
];

async function testConnection(url: string, region: string) {
    log(`Testing region: ${region} ...`);
    const prisma = new PrismaClient({
        datasources: { db: { url } },
        log: [],
    });

    try {
        // Set a timeout? Prisma default is 10s or 30s.
        await prisma.$connect();
        log(`SUCCESS! Region ${region} is correct.`);
        await prisma.$disconnect();
        return true;
    } catch (e: any) {
        log(`Failed ${region}: ${e.message.split('\n')[0]}`); // Log only first line
        await prisma.$disconnect();
        return false;
    }
}

async function main() {
    for (const region of regions) {
        const url = `postgres://postgres.${PROJ}:${PASS}@aws-0-${region}.pooler.supabase.com:5432/postgres`;
        if (await testConnection(url, region)) {
            log(`\nFOUND CORRECT URL: ${url}`);
            // Write it to a file so we can see it clearly
            fs.writeFileSync('correct_url.txt', url);
            process.exit(0);
        }
    }
    log('All regions failed.');
    process.exit(1);
}

main()
