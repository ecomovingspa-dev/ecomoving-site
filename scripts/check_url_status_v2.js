
const https = require('https');

const urls = [
    'https://xgdmyjzyejjmwdqkufhp.supabase.co/storage/v1/object/public/imagenes-marketing/catalog-manual/0.5520614481899453-1770606002617.webp',
    'https://xgdmyjzyejjmwdqkufhp.supabase.co/storage/v1/object/public/imagenes-marketing/catalog/0.5520614481899453-1770606002617.webp'
];

urls.forEach(url => {
    https.get(url, (res) => {
        console.log(`URL: ${url} -> Status: ${res.statusCode}`);
    }).on('error', (e) => {
        console.error(e);
    });
});
