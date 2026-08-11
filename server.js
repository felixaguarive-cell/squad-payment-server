const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Enable CORS security rules so your local web browser can speak to this server without blocking errors
app.use(cors());
app.use(express.json());

// Pulls your secret token securely from the Render dashboard environment variable settings
const SQUAD_SECRET_KEY = process.env.SQUAD_SECRET_KEY; 
const SQUAD_BASE_URL = "https://squadco.com"; 

app.post('/create-customer-account', async (req, res) => {
    try {
        const { first_name, last_name, email, phone, bvn } = req.body;

        // Structured payload required by the Squad Sandbox Virtual Account endpoint
        const squadPayload = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone_number: phone,
            bvn: bvn,             
            currency_code: "NGN"
        };

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

        return res.status(200).json({
            success: true,
            message: "Virtual account created successfully!",
            account_details: response.data.data
        });

    } catch (error) {
        console.error("Squad API Error Logs:", error.response ? error.response.data : error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to generate bank account",
            error: error.response ? error.response.data : error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Your AI payment server is running live on port ${PORT}`);
});
