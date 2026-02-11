import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function run() {
    try {
        console.log('--- Starting Emergency Loan Verification ---');

        // 1. Login
        console.log('1. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            phoneNumber: '0722240413',
            password: 'password123' // Or the password set in seed
        });
        const token = loginRes.data.token;
        const headers = { Authorization: `Bearer ${token}` };
        console.log('   Login successful.');

        // 2. Create Member
        console.log('2. Creating Member...');
        const memberRes = await axios.post(`${API_URL}/members`, {
            fullName: 'Emergency Test Member',
            phoneNumber: `+2547${Math.floor(Math.random() * 100000000)}`,
            idNumber: `${Math.floor(Math.random() * 10000000)}`
        }, { headers });
        const memberId = memberRes.data.id;
        console.log(`   Member created: ${memberId}`);

        // 3. Create Normal Loan
        console.log('3. Creating NORMAL Loan...');
        const normalLoanRes = await axios.post(`${API_URL}/loans`, {
            memberId,
            principalAmount: 10000,
            loanDurationMonths: 12,
            type: 'NORMAL'
        }, { headers });

        console.log(`   Normal Loan Interest Rate: ${normalLoanRes.data.interestRate}% (Expected: 12.5)`);
        if (normalLoanRes.data.interestRate !== 12.5) throw new Error('Normal loan interest rate incorrect');

        // 4. Create Emergency Loan
        console.log('4. Creating EMERGENCY Loan...');
        const emergencyLoanRes = await axios.post(`${API_URL}/loans`, {
            memberId,
            principalAmount: 10000,
            loanDurationMonths: 6,
            type: 'EMERGENCY'
        }, { headers });

        console.log(`   Emergency Loan Interest Rate: ${emergencyLoanRes.data.interestRate}% (Expected: 5)`);
        if (emergencyLoanRes.data.interestRate !== 5) throw new Error('Emergency loan interest rate incorrect');

        console.log('--- Verification Complete: SUCCESS ---');

    } catch (error: any) {
        console.error('--- Verification Failed ---');
        console.error(error.response ? error.response.data : error.message);
        // process.exit(1); // Optional, but lets us see output
    }
}

run();
