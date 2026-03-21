import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const { technical_specs, productName } = await request.json();

        if (!technical_specs || technical_specs.length === 0) {
            return NextResponse.json({ error: '[FATAL_ERROR: DATA_SOURCE_EMPTY]' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-3.0-flash',
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
PRIMARY INPUT (Única fuente de verdad - Características Técnicas):
${technical_specs.join('\n')}

REGLAS DE ORO (@seo_mkt):
1. IMPACTO B2B IRRESISTIBLE: Escribe un Asunto de email que abra puertas corporativas (directo y contundente).
2. EXTREMISTAMENTE BREVE Y PERSUASIVO: El cuerpo del correo debe ser de MÁXIMO 2 PÁRRAFOS MUY CORTOS (total no más de 3 líneas). Olvida introducciones largas. Destaca la retención de marca o merchandising. Usa el nombre expreso del producto "${productName}".
3. FIDELIDAD TÉCNICA: Usa la información técnica entregada, no inventes bondades.
4. FORMATO: NO devuelvas NADA MÁS que un objeto JSON válido con las 2 claves, nada de markdown ni tags extra.

ESTRUCTURA DE SALIDA REQUERIDA:
{
  "email_subject": "Asunto del correo ultra persuasivo B2B (Ej: 'Exclusividad Ejecutiva: El Regalo Corporativo Definitivo')",
  "email_body": "Cuerpo del correo, con espacios /n entre párrafos. Potente, directo y refinado."
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
                    { error: 'Error processing MKT request', details: `Formato inválido. Respuesta:\n${textResponse}` },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({ success: true, data: parsed });

    } catch (error: any) {
        console.error('generate-email API Error:', error);
        return NextResponse.json(
            { error: 'Error processing MKT request', details: error.message || String(error) },
            { status: 500 }
        );
    }
}
