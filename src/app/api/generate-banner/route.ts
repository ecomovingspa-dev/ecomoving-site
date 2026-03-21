import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const { technical_specs, productName } = await request.json();

        if (!technical_specs || technical_specs.length === 0) {
            return NextResponse.json({ error: '[FATAL_ERROR: DATA_SOURCE_EMPTY]' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-3.0-flash' });

        const prompt = `
PRIMARY INPUT (Única fuente de verdad - Características Técnicas):
${technical_specs.join('\n')}

REGLAS DE ORO (@seo_mkt / @adn - Publicidad):
1. IMPACTO PUBLICITARIO HERO: Eres el publicista top tier B2B. Estás escribiendo el texto para un banner gigante de formato horizontal (16:9).
2. EXTREMISTAMENTE BREVE: 
   - tag: Etiqueta pequeña (máximo 2 palabras, ej: 'INNOVACIÓN VERDE')
   - slogan: Titular explosivo (máximo 5 palabras, ej: 'Fuerza Implacable, Estilo Sostenible').
   - sub_slogan: Subtítulo para apoyar (máximo 8 palabras).
   - cta: Acción del botón (máximo 2 palabras, ej: 'PEDIR DEMO').
3. FIDELIDAD TÉCNICA: Usa la información técnica entregada, no inventes bondades.
4. FORMATO: NO devuelvas NADA MÁS que un objeto JSON válido, nada de markdown extra.

ESTRUCTURA DE SALIDA REQUERIDA:
{
  "tag": "ETIQUETA SUP (Ej: 'ALTA GAMA')",
  "slogan": "TITULAR (Ej: 'Redefiniendo el Transporte Ecológico')",
  "sub_slogan": "SUBTITULAR (Ej: 'Potencia térmica diseñada para ejecutivos nómades.')",
  "cta": "BOTÓN (Ej: 'COTIZAR AHORA')"
}
`;

        const result = await model.generateContent(prompt);
        const textResponse = result.response.text();

        let parsed;
        try {
            const cleanText = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            parsed = JSON.parse(cleanText);
        } catch (e) {
            const jsonMatch = textResponse.match(/\\{[\\s\\S]*\\}/);
            if (jsonMatch) {
                parsed = JSON.parse(jsonMatch[0]);
            } else {
                return NextResponse.json(
                    { error: 'Error processing Banner request', details: `Formato inválido. Respuesta:\n${textResponse}` },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({ success: true, data: parsed });

    } catch (error: any) {
        console.error('generate-banner API Error:', error);
        return NextResponse.json(
            { error: 'Error processing Banner request', details: error.message || String(error) },
            { status: 500 }
        );
    }
}
