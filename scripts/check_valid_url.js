
const https = require('https');

const url = 'https://xgdmyjzyejjmwdqkufhp.supabase.co/storage/v1/object/public/imagenes-marketing/catalog/0.003129468831853055-1770429490922.jpg';

https.get(url, (res) => {
    console.log(`URL: ${url} -> Status: ${res.statusCode}`);
}).on('error', (e) => {
    console.error(e);
});
