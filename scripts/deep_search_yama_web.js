
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function deepSearchYama() {
    console.log('Deep searching YAMA in web_contenido...');
    const { data: allRows, error } = await supabase
        .from('web_contenido')
        .select('*');

    if (error) {
        console.error('Error:', error);
        return;
    }

    allRows.forEach(row => {
        const contentStr = JSON.stringify(row.content);
        if (contentStr.includes('YAMA')) {
            console.log(`Found in section "${row.section}":`);
            // Find the specific block or field
            console.log(JSON.stringify(row.content, null, 2).split('\n').filter(line => line.includes('YAMA')).join('\n'));
        }
    });
}

deepSearchYama();
