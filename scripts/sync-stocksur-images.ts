import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_PATH = 'C:\\Users\\Mario\\Desktop\\stocksur_imagenes\\T';
const BUCKET_NAME = 'imagenes-marketing';
const STORAGE_FOLDER = 'catalogo';

const DRY_RUN = false; // Cambiar a false para ejecutar cambios reales

const slugify = (text: string) => {
    if (!text) return "";
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

async function runSync() {
    console.log(` iniciando sincronización masiva de STOCKSUR...`);
    console.log(` MODO: ${DRY_RUN ? 'SOLO REPORTE (DRY RUN)' : 'EJECUCIÓN REAL'}`);

    const { data: products, error } = await supabase
        .from('productos')
        .select('*')
        .eq('wholesaler', 'Stocksur');

    if (error) {
        console.error(' Error al obtener productos:', error);
        return;
    }

    console.log(` Se encontraron ${products.length} productos de Stocksur en la base de datos.`);

    let processedCount = 0;
    let imagesUploadedCount = 0;

    for (const prod of products) {
        const sku = prod.sku_externo || prod.id;
        if (!sku) continue;

        const localFolder = path.join(BASE_PATH, sku);

        if (!fs.existsSync(localFolder)) {
            // console.log(` [SKIPPED] No se encontró carpeta para SKU: ${sku}`);
            continue;
        }

        const files = fs.readdirSync(localFolder).filter(f =>
            f.match(/\.(jpg|jpeg|png|webp|avif)$/i)
        );

        if (files.length === 0) {
            console.log(` [EMPTY] Carpeta ${sku} no tiene imágenes válidas.`);
            continue;
        }

        console.log(` [PROCESSING] SKU: ${sku} | ${files.length} imágenes encontradas.`);
        processedCount++;

        const newGalleryUrls: string[] = [];
        const productSlug = slugify(prod.nombre);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const localFilePath = path.join(localFolder, file);
            const seoName = `${productSlug}-${sku}-${i + 1}.webp`;
            const remotePath = `${STORAGE_FOLDER}/${seoName}`;

            if (!DRY_RUN) {
                try {
                    // Procesamiento con SHARP (ADN & SEO Standards)
                    const buffer = fs.readFileSync(localFilePath);
                    const optimizedBuffer = await sharp(buffer)
                        .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
                        .webp({ quality: 82 })
                        .toBuffer();

                    // Subir a Supabase
                    const { error: uploadError } = await supabase.storage
                        .from(BUCKET_NAME)
                        .upload(remotePath, optimizedBuffer, {
                            contentType: 'image/webp',
                            upsert: true
                        });

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from(BUCKET_NAME)
                        .getPublicUrl(remotePath);

                    newGalleryUrls.push(publicUrl);
                    imagesUploadedCount++;
                } catch (err) {
                    console.error(`  Error procesando ${file} para SKU ${sku}:`, err);
                }
            } else {
                // Simulación de URL
                newGalleryUrls.push(`https://simulated-storage.com/${remotePath}`);
                imagesUploadedCount++;
            }
        }

        if (newGalleryUrls.length > 0) {
            if (!DRY_RUN) {
                // Actualizar DB (Protocolo de Reemplazo Total)
                const { error: updateError } = await supabase
                    .from('productos')
                    .update({
                        imagen_principal: newGalleryUrls[0],
                        imagenes_galeria: newGalleryUrls
                    })
                    .eq('id', prod.id);

                if (updateError) {
                    console.error(`  Error actualizando DB para SKU ${sku}:`, updateError);
                } else {
                    console.log(`  ?? SKU ${sku} actualizado con ${newGalleryUrls.length} imágenes.`);
                }
            } else {
                console.log(`  [DRY RUN] Se actualizaría SKU ${sku} con ${newGalleryUrls.length} imágenes.`);
            }
        }
    }

    console.log('\n--- RESUMEN FINAL ---');
    console.log(` Productos procesados con éxito: ${processedCount}`);
    console.log(` Imágenes ${DRY_RUN ? 'simuladas' : 'subidas'}: ${imagesUploadedCount}`);
    console.log('---------------------\n');
}

runSync();
