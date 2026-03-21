
const https = require('https');

const url = 'https://xgdmyjzyejjmwdqkufhp.supabase.co/storage/v1/object/public/imagenes-marketing/catalog-manual/0.5520614481899453-1770606002617.webp';

https.get(url, (res) => {
    console.log(`URL: ${url}`);
    console.log(`Status Code: ${res.statusCode}`);
}).on('error', (e) => {
    console.error(e);
});
