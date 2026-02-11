import axios from 'axios';

const API_URL = 'http://localhost:3000/api';
let token: string;
let adminId: string;
let memberId: string;
let loanId: string;
let paymentId: string;
let contributionId: string;

async function run() {
    try {
        console.log('--- Starting Verification Flow ---');

        // 1. Login
        console.log('1. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            phoneNumber: '0722240413', // Default admin phone
            password: 'password123'
        });
        token = loginRes.data.token;
        adminId = loginRes.data.admin.id;
        console.log('   Login successful. Token received.');

        const headers = { Authorization: `Bearer ${token}` };

        // 2. Create Member
        console.log('2. Creating Member...');
        const memberRes = await axios.post(`${API_URL}/members`, {
            fullName: 'Test Member',
            phoneNumber: `+2547${Math.floor(Math.random() * 100000000)}`,
            idNumber: `${Math.floor(Math.random() * 10000000)}`
        }, { headers });
        memberId = memberRes.data.id;
        console.log(`   Member created: ${memberId}`);

        // 3. Create Loan
        console.log('3. Creating Loan...');
        const loanRes = await axios.post(`${API_URL}/loans`, {
            memberId,
            principalAmount: 10000,
            loanDurationMonths: 12
        }, { headers });
        loanId = loanRes.data.id;
        console.log(`   Loan created: ${loanId}`);

        // Approve Loan (needed for payments usually, but system might allow payments on pending, let's approve to be safe)
        await axios.put(`${API_URL}/loans/${loanId}/status`, { status: 'ACTIVE' }, { headers });
        console.log('   Loan approved.');

        // 4. Create Payment (Pending)
        console.log('4. Creating Payment (Pending)...');
        const paymentRes = await axios.post(`${API_URL}/payments`, {
            loanId,
            amountPaid: 1000,
            paymentDate: new Date().toISOString(),
            method: 'MPESA',
            referenceCode: 'TESTREF123'
        }, { headers });
        paymentId = paymentRes.data.id;
        console.log(`   Payment created: ${paymentId}. Status: ${paymentRes.data.isConfirmed ? 'Confirmed' : 'Pending'}`);

        if (paymentRes.data.isConfirmed) throw new Error('Payment should be pending initially');

        // Verify Loan Balance hasn't changed yet (optional, but good)
        const loanCheck1 = await axios.get(`${API_URL}/loans`, { headers });
        const loan1 = loanCheck1.data.find((l: any) => l.id === loanId);
        console.log(`   Loan Balance before confirm: ${loan1.remainingBalance} (Should be initial total)`);

        // 5. Confirm Payment
        console.log('5. Confirming Payment...');
        const confirmRes = await axios.patch(`${API_URL}/payments/${paymentId}/confirm`, {
            referenceCode: 'TESTREF123_CONFIRMED'
        }, { headers });
        console.log(`   Payment confirmed. ConfirmedAt: ${confirmRes.data.confirmedAt}`);

        // Verify Loan Balance Updated
        const loanCheck2 = await axios.get(`${API_URL}/loans`, { headers });
        const loan2 = loanCheck2.data.find((l: any) => l.id === loanId);
        console.log(`   Loan Balance after confirm: ${loan2.remainingBalance} (Should be less than before)`);

        if (loan2.remainingBalance >= loan1.remainingBalance) throw new Error('Loan balance did not decrease!');

        // 6. Create Contribution (Pending)
        console.log('6. Creating Contribution...');
        const contRes = await axios.post(`${API_URL}/contributions`, {
            memberId,
            amount: 500,
            date: new Date().toISOString(),
            method: 'CASH'
        }, { headers });
        contributionId = contRes.data.id;
        console.log(`   Contribution created: ${contributionId}. Status: ${contRes.data.isConfirmed ? 'Confirmed' : 'Pending'}`);

        // 7. Confirm Contribution
        console.log('7. Confirming Contribution...');
        await axios.patch(`${API_URL}/contributions/${contributionId}/confirm`, {}, { headers });
        console.log('   Contribution confirmed.');

        console.log('--- Verification Complete: SUCCESS ---');

    } catch (error: any) {
        console.error('--- Verification Failed ---');
        console.error(error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

run();
