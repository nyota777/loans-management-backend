import dns from 'dns';

const host = 'db.uvzisyaxdmdopxghxkid.supabase.co';

console.log(`Resolving ${host}...`);

dns.resolve4(host, (err, addresses) => {
    if (err) console.log('IPv4 (A) lookup failed:', err.message);
    else console.log('IPv4 addresses:', addresses);
});

dns.resolve6(host, (err, addresses) => {
    if (err) console.log('IPv6 (AAAA) lookup failed:', err.message);
    else console.log('IPv6 addresses:', addresses);
});
