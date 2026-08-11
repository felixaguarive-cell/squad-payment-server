const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const SQUAD_SECRET_KEY = process.env.SQUAD_SECRET_KEY;
const SQUAD_BASE_URL = "https://sandbox-api-d.squadco.com";

app.post('/create-customer-account', async (req, res) => {
    try {
        const { first_name, last_name, email, phone, bvn } = req.body;

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

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Your AI payment server is running live on port ${PORT}`);
});
