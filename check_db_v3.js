
const https = require('https');

const url = 'https://xgdmyjzyejjmwdqkufhw.supabase.co/rest/v1/agent_buffer?select=*&limit=1';
const apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZG15anp5ZWpqbXdkcXJ1ZmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgzMzM4NzgsImV4cCI6MjAyMzkzMzg3OH0.SWRzWjOW53emkiLjg95ilmHzEDxmS39C-Pn0s4B7z_gLRiy3nFrzDGnt7EE';

const options = {
    headers: {
        'apikey': apikey,
        'Authorization': 'Bearer ' + apikey
    }
};

https.get(url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.length > 0) {
                console.log(Object.keys(json[0]));
            } else {
                console.log('No data found in agent_buffer');
            }
        } catch (e) {
            console.log('Error parsing JSON:', data);
        }
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
