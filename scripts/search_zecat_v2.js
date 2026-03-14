
const https = require('https');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const ZECAT_TOKEN = process.env.NEXT_PUBLIC_ZECAT_TOKEN;

async function searchZecat() {
    console.log('Searching for T763 on Zecat using https...');

    // The format of the token might be important. Sometimes it's a Basic auth token disguised.
    // NEXT_PUBLIC_ZECAT_TOKEN=bWFyaW9AYWdlbmNpYWdyYWZpY2EuY2w6ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LklqRXljREUzYWhGa2QzWm1PVzUzZW1raS44OTVpbG1IekVEeG1TMzlDLVBuMHM0Qjd6X2dMUml5M25GcnpER250N0VF
    // Decoded it's mario@agenciagrafica.cl:eyJ... (a JWT)

    const options = {
        hostname: 'api.zecat.cl',
        path: '/v1/products/T763',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${ZECAT_TOKEN}`
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log(`Status: ${res.statusCode}`);
            try {
                const parsed = JSON.parse(data);
                console.log('Zecat Data:', JSON.stringify(parsed, null, 2));
            } catch (e) {
                console.log('Response:', data);
            }
        });
    });

    req.on('error', (e) => {
        console.error('Error:', e.message);
    });
    req.end();
}

searchZecat();
