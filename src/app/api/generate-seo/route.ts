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
Eres el Módulo de Inteligencia Semántica (@seo_mkt) de Ecomoving SpA. 
Tu misión: Transformar datos técnicos áridos en metadata SEO y copy de muy alto impacto comercial B2B.

PRIMARY INPUT (Única fuente de verdad - Características Técnicas):
${technical_specs.join('\n')}

REGLAS DE ORO (@seo_mkt):
1. PROHIBICIÓN DE NOMBRES: Prohibido mencionar nombres específicos de productos (ej. "SILLY", "YAMA") en el texto generado.
2. FIDELIDAD TÉCNICA: No inventes características, materiales ni capacidades. Usa solo los atributos técnicos del input.
3. TONO COMERCIAL B2B: Directo, sofisticado y orientado a tomadores de decisiones corporativas.
4. EXTREMA BREVEDAD (HERO BANNER): El "seo_title" debe ser un gancho hiper-resumido de máximo 3 a 5 palabras súper potentes. El "seo_description" debe ser una frase corta y contundente, no un párrafo largo.
5. FORMATO: Devuelve ÚNICAMENTE un objeto JSON válido con las claves exactas. Sin markdown, sin explicaciones.

ESTRUCTURA DE SALIDA REQUERIDA (NO RESPONDAS NADA MÁS QUE ESTE JSON):
{
  "seo_title": "Título GANCHO hiper-resumido (ej. 'MERCHANDISING ECO PREMIUM', máximo 40 caracteres)",
  "seo_keywords": "3 a 5 palabras clave de cola larga, separadas por coma",
  "seo_description": "Subtítulo cortísimo y contundente para acompañar el Hero (máximo 80 caracteres)"
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
