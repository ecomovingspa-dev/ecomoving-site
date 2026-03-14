const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function purgeAll() {
    let hasMore = true;
    while (hasMore) {
        const { data: c } = await supabase.storage.from('imagenes-marketing').list('catalogo', { limit: 100 });
        if (c && c.length > 0) {
            const paths = c.map(f => 'catalogo/' + f.name);
            console.log('Deleting from catalogo chunk:', paths.length);
            const { error } = await supabase.storage.from('imagenes-marketing').remove(paths);
            if (error) {
                console.error("Error removing", error);
                hasMore = false;
            }
        } else {
            hasMore = false;
        }
    }

    hasMore = true;
    while (hasMore) {
        const { data: h } = await supabase.storage.from('imagenes-marketing').list('hero', { limit: 100 });
        if (h && h.length > 0) {
            const paths = h.map(f => 'hero/' + f.name);
            console.log('Deleting from hero chunk:', paths.length);
            const { error } = await supabase.storage.from('imagenes-marketing').remove(paths);
            if (error) {
                console.error("Error removing hero", error);
                hasMore = false;
            }
        } else {
            hasMore = false;
        }
    }

    const rootGarbage = ['imagen_1.jpg', 'imagen_2.jpg', 'imagen_3.jpg', '.emptyFolderPlaceholder'];
    console.log('Deleting root garbage:', rootGarbage);
    const { error } = await supabase.storage.from('imagenes-marketing').remove(rootGarbage);
    console.log('Finished. Root garbage clear error state:', error);
}

purgeAll();
