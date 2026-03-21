
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const ZECAT_TOKEN = process.env.NEXT_PUBLIC_ZECAT_TOKEN;

async function searchZecat() {
    console.log('Searching for T763 on Zecat...');
    try {
        const response = await axios.get('https://api.zecat.cl/v1/products/T763', {
            headers: {
                'Authorization': `Bearer ${ZECAT_TOKEN}`
            }
        });
        console.log('Zecat Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error fetching from Zecat:', error.message);
        if (error.response) console.log(error.response.data);
    }
}

searchZecat();
