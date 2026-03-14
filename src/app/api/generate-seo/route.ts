import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const { technical_specs } = await request.json();

        if (!technical_specs || technical_specs.length === 0) {
            return NextResponse.json({ error: '[FATAL_ERROR: DATA_SOURCE_EMPTY]' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `
Eres el Módulo de Inteligencia Semántica (@seo_mkt) de Ecomoving SpA — el Motor Creativo B2B de merchandising sustentable premium para Chile y LATAM.

PRIMARY INPUT (Única fuente de verdad — Atributos del Activo):
${technical_specs.join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━
PROTOCOLO ADN @seo_mkt — REGLAS INQUEBRANTABLES
━━━━━━━━━━━━━━━━━━━━━━━━

1. FIDELIDAD ABSOLUTA: Solo usas lo que está en el PRIMARY INPUT. Prohibido inventar certificaciones, materiales, impactos o capacidades ausentes en los datos.
2. PROHIBICIÓN DE MARCAS/NOMBRES PROPIOS: No menciones modelos ni marcas de producto. El copy habla del BENEFICIO y POSICIONAMIENTO, no del ítem.
3. TONO "CIERRE DE NEGOCIO" B2B: El decisor corporativo (Gerente de RRHH, Marketing o Compras) lee esto. El copy debe transmitir superioridad técnica, autoridad y urgencia ejecutiva. Cero relleno. Cero entusiasmo barato.
4. ARQUITECTURA SEMÁNTICA GOOGLE 2026: El seo_title y seo_keywords deben construir un grafo de autoridad, no solo palabras clave. Vincula conceptos como "Sostenibilidad", "Fidelización B2B", "Economía Circular" cuando el input lo justifique.
5. BREVEDAD QUIRÚRGICA PARA HERO BANNER:
   - seo_title: Máximo 5 palabras. Gancho de impacto. Ej: "IMPACTO REAL. HUELLA CERO."
   - seo_description: Máximo 90 caracteres. Una sola frase contundente. Ej: "Fidelice con impacto: Merchandising sustentable premium para su estrategia corporativa."
   - seo_keywords: 4 a 6 términos de cola larga separados por coma, orientados a búsqueda B2B.
6. FORMATO ESTRICTO: Devuelve ÚNICAMENTE el objeto JSON. Sin markdown, sin \`\`\`, sin explicaciones previas o posteriores.

━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUCTURA DE SALIDA — RESPONDE SOLO ESTO:
━━━━━━━━━━━━━━━━━━━━━━━━
{
  "seo_title": "GANCHO: máximo 5 palabras de alto impacto B2B en mayúsculas",
  "seo_keywords": "termo sustentable corporativo, merchandising ecológico Chile, regalo ejecutivo sustentable, fidelización B2B premium",
  "seo_description": "Subtítulo contundente de máximo 90 caracteres para acompañar el Hero Banner"
}
`;

        const result = await model.generateContent(prompt);
        const textResponse = result.response.text();

        let parsed;
        try {
            const cleanText = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            parsed = JSON.parse(cleanText);
        } catch (e) {
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsed = JSON.parse(jsonMatch[0]);
            } else {
                return NextResponse.json(
                    { error: 'Error processing SEO request', details: `Formato inválido. Respuesta de la IA:\n${textResponse}` },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({ success: true, data: parsed });

    } catch (error: any) {
        console.error('generate-seo API Error:', error);
        return NextResponse.json(
            { error: 'Error processing SEO request', details: error.message || String(error) },
            { status: 500 }
        );
    }
}
