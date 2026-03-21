
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllBucketsContent() {
    console.log('Fetching all buckets...');
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error('Error fetching buckets:', error.message);
        return;
    }

    console.log(`Found ${buckets.length} buckets.`);
    for (const b of buckets) {
        console.log(`\n--- Bucket: ${b.name} (Public: ${b.public}) ---`);
        const { data: files, error: listError } = await supabase.storage.from(b.name).list('', { limit: 10 });
        if (listError) {
            console.log(`  Error listing: ${listError.message}`);
        } else {
            console.log(`  Items: ${files.length}`);
            files.forEach(f => console.log(`  - ${f.name}`));
        }
    }
}

listAllBucketsContent();
