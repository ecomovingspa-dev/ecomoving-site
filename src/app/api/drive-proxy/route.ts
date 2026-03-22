import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
    }

    // Intentamos obtener la imagen con headers de navegador para evitar bloqueos
    const fetchImage = async (targetUrl: string) => {
        return await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                'Referer': 'https://drive.google.com/',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
            }
        });
    };

    try {
        console.log('[Drive Proxy] Attempting fetch:', url);
        let response = await fetchImage(url);

        // Si falla el primer intento (ej: 403 o 404), intentamos con el formato alternativo si es un thumbnail de Drive
        if (!response.ok && url.includes('drive.google.com/thumbnail')) {
            const fileId = new URL(url).searchParams.get('id');
            if (fileId) {
                console.log('[Drive Proxy] First attempt failed, trying alternate format for ID:', fileId);
                // El formato lh3 suele ser más permisivo
                const alternateUrl = `https://lh3.googleusercontent.com/u/0/d/${fileId}=w1200`;
                response = await fetchImage(alternateUrl);
            }
        }

        if (!response.ok) {
            console.error(`[Drive Proxy] All attempts failed. Final status: ${response.status}`);
            throw new Error(`Fetch failed with status ${response.status}`);
        }

        const blob = await response.blob();
        const headers = new Headers();

        // Propagar el content-type real o por defecto a jpeg
        const contentType = response.headers.get('Content-Type');
        headers.set('Content-Type', contentType && contentType.includes('image') ? contentType : 'image/jpeg');
        headers.set('Cache-Control', 'public, max-age=86400');

        return new NextResponse(blob, { headers });
    } catch (error: any) {
        console.error('[Drive Proxy] Error:', error.message);
        return NextResponse.json({ error: 'Failed to fetch image from Drive', details: error.message }, { status: 500 });
    }
}
