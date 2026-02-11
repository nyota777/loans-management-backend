import dns from 'dns';
import fs from 'fs';

const host = 'db.iyyjiaunmgxfvdiwzdou.supabase.co';

console.log(`Resolving ${host}...`);

dns.resolve4(host, (err, addresses) => {
    if (err) {
        console.log('IPv4 (A) lookup failed:', err.message);
        fs.writeFileSync('ip_address.txt', 'ERROR: ' + err.message);
    } else {
        console.log('IPv4 addresses:', addresses);
        if (addresses.length > 0) {
            fs.writeFileSync('ip_address.txt', addresses[0]);
        }
    }
});
