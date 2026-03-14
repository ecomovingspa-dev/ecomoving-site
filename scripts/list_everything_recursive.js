
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listEverything() {
    const { data: buckets, error: bError } = await supabase.storage.listBuckets();
    if (bError) {
        console.error('Error listing buckets:', bError);
        // Fallback to known buckets if listBuckets fails
        const knownBuckets = ['imagenes-marketing', 'logotipo_ecomoving', 'assets', 'public', 'products'];
        for (const bucket of knownBuckets) {
            await listBucketRecursive(bucket, '');
        }
    } else {
        for (const bucket of buckets) {
            await listBucketRecursive(bucket.name, '');
        }
    }
}

async function listBucketRecursive(bucketName, path) {
    console.log(`Listing ${bucketName}/${path}...`);
    const { data, error } = await supabase.storage.from(bucketName).list(path, { limit: 100 });
    if (error) {
        console.error(`Error listing ${bucketName}/${path}:`, error.message);
        return;
    }

    for (const item of data) {
        if (item.id) { // It's a file
            console.log(`FILE: ${bucketName}/${path}${item.name}`);
        } else { // It's a folder
            await listBucketRecursive(bucketName, `${path}${item.name}/`);
        }
    }
}

listEverything();
