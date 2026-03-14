
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function searchBufferYama() {
    console.log('Searching for YAMA in agent_buffer...');
    const { data, error } = await supabase
        .from('agent_buffer')
        .select('*')
        .ilike('name', '%YAMA%');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Found ${data.length} matches.`);
    if (data.length > 0) {
        data.forEach(r => {
            console.log(`- ${r.name}`);
            console.log(`  Images: ${JSON.stringify(r.images)}`);
        });
    }
}

searchBufferYama();
