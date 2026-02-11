import axios from "axios";

const API_URL = "http://localhost:3001";

// New member data
const newMember = {
    fullName: "Test Member",
    phoneNumber: `07${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    idNumber: "12345678",
    totalContributions: 0
};

async function testAddMember() {
    console.log("Attempting to add member:", newMember);
    try {
        const response = await axios.post(`${API_URL}/members`, newMember);
        console.log("Member Added Successfully!");
        console.log("Status:", response.status);
        console.log("Member ID:", response.data.id);
    } catch (error: any) {
        console.error("Failed to add member:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error:", error.message);
        }
    }
}

testAddMember();
