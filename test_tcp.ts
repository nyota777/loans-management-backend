import net from 'net';

const host = '34.117.176.2'; // db.uvzisyaxdmdopxghxkid.supabase.co
const port = 5432;

console.log(`Connecting to ${host}:${port}...`);

const socket = new net.Socket();
socket.setTimeout(5000);

socket.connect(port, host, () => {
    console.log('TCP Connection established!');
    socket.end();
});

socket.on('timeout', () => {
    console.log('Connection timed out.');
    socket.destroy();
});

socket.on('error', (err) => {
    console.log('Connection failed:', err.message);
});
