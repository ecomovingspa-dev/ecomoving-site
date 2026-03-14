
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-client');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkColumns() {
    const { data, error } = await supabase.from('productos').select('*').limit(1);
    if (error) {
        console.error(error);
    } else {
        console.log(Object.keys(data[0]));
    }
}

checkColumns();
