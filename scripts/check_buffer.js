
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBuffer() {
    process.stdout.write('Checking table "agent_buffer"... ');
    try {
        const { data, error } = await supabase.from('agent_buffer').select('*').limit(10);
        if (error) {
            console.log(`NO (${error.message})`);
        } else {
            console.log(`FOUND! (${data.length} rows)`);
            if (data.length > 0) {
                console.log('Sample row names:');
                data.forEach(r => console.log(`- ${r.nombre || r.product_name || 'unnamed'}`));
                if (JSON.stringify(data).includes('YAMA')) console.log('YAMA FOUND IN BUFFER!');
            }
        }
    } catch (e) {
        console.log(`NO (exception: ${e.message})`);
    }
}

checkBuffer();
