const express = require('express');
const axios = require('axios');
const app = express();

// This allows your server to read incoming JSON text data
app.use(express.json());

// 1. Paste your Sandbox Secret Key from your Squad Dashboard here
const SQUAD_SECRET_KEY = process.env.SQUAD_SECRET_KEY || "sandbox_sk_YOUR_ACTUAL_KEY_HERE"; 
const SQUAD_BASE_URL = "https://sandbox-api-d.squadco.com"; // Test environment

// 2. This is the web pipeline your website or app will call
app.post('/create-customer-account', async (req, res) => {
    try {
        // Data your app sends to this script: customer name, bvn, nin, etc.
        const { first_name, last_name, email, phone, bvn } = req.body;

        // The structure Squad requires to create a named virtual account
        const squadPayload = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone_number: phone,
            bvn: bvn,             // Required by CBN for named accounts
            currency_code: "NGN"
        };

        // Sending the data directly to Squad's servers securely
        const response = await axios.post(
            `${SQUAD_BASE_URL}/virtual-account`, 
            squadPayload, 
            {
                headers: {
                    'Authorization': `Bearer ${SQUAD_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Send Squad's bank account response straight back to your client
        return res.status(200).json({
            success: true,
            message: "Virtual account created successfully!",
            account_details: response.data.data
        });

    } catch (error) {
        console.error("Squad API Error:", error.response ? error.response.data : error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to generate bank account",
            error: error.response ? error.response.data : error.message
        });
    }
});

// Start the server on whatever port the cloud host gives us
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Your AI payment server is running live on port ${PORT}`);
});
