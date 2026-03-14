import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const { action, text, context, section } = await request.json();

        if (!action) {
            return NextResponse.json({ error: 'Action is required' }, { status: 400 });
        }
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.9,
                topP: 0.95,
                responseMimeType: "application/json"
            }
        });
        let prompt = '';
        let systemContext = `Rol: Redactor SEO B2B para Ecomoving.
Regla: Prohibido usar frases genéricas pre-armadas. El texto debe ser único y basarse estrictamente en los datos técnicos técnicos y el contexto entregado.`;

        switch (action) {
            case 'analyze':
                prompt = `${systemContext}

Analiza este texto para la sección "${section || 'General'}":
"${text}"

Proporciona:
1. Puntuación SEO (0-100)
2. Fortalezas
3. Debilidades
4. Sugerencia de mejora

Responde en formato JSON:
{
  "score": number,
  "strengths": ["string"],
  "weaknesses": ["string"],
  "suggestions": ["string"]
}`;
                break;

            case 'improve':
                prompt = `${systemContext}

INSTRUCCIONES PRINCIPALES DEL FRONTEND:
${context || 'Mejora este texto'}

Texto a procesar:
"${text}"

Responde EXCLUSIVAMENTE en JSON:
{
  "improved": "tu_texto_aqui"
}`;
                break;

            case 'generate':
                prompt = `${systemContext}

Genera un nuevo texto optimizado para SEO.
            Sección: ${section}
Tipo de contenido: ${context || 'descripción'}

        Requisitos:
        - Máximo 2 - 3 oraciones para descripciones
            - 5 - 8 palabras para títulos
                - Incluir al menos 1 keyword principal
                    - Tono premium y profesional

Responde en formato JSON:
{
  "text": "texto generado",
  "keywords": ["keyword1", "keyword2"],
  "seo_tips": ["tip1", "tip2"]
}`;
                break;

            case 'auto_optimize':
                prompt = `${systemContext}

Optimiza TODOS los campos de texto de la siguiente sección para máximo impacto SEO y comercial. 
Debes mejorar la redacción, incluir palabras clave estratégicas de forma natural y mantener el tono premium.

Contenido actual de la sección:
${JSON.stringify(text)}

Requisitos por campo:
        - Títulos: 5 - 10 palabras, impactantes y con keyword principal.
- Párrafos: 2 - 3 oraciones, informativos y persuasivos.

Responde en formato JSON:
{
  "optimized": { "...": "" },
  "summary": "Resumen de las mejoras realizadas"
}`;
                break;

            case 'audit':
                prompt = `${systemContext}

Realiza una auditoría SEO completa de los siguientes textos de la landing page:

${text}

        Proporciona:
        1. Puntuación general(0 - 100)
        2. Análisis por sección
        3. Recomendaciones prioritarias(top 5)
        4. Meta tags sugeridos(title y description)

Responde en formato JSON:
{
  "overall_score": 0,
  "section_scores": { "hero": 0, "mugs": 0 },
  "priority_recommendations": ["string"],
  "meta_tags": {
    "title": "string (máx 60 caracteres)",
    "description": "string (máx 160 caracteres)"
  }
}`;
                break;

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        const result = await model.generateContent(prompt);
        const response = result.response;
        const textResponse = response.text();

        // Intentar parsear como JSON de forma robusta
        let parsedData: any = null;
        try {
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const cleanedJson = jsonMatch[0].trim();
                parsedData = JSON.parse(cleanedJson);
            }
        } catch (e) {
            console.error('Failed to parse AI JSON:', e);
        }

        if (parsedData) {
            return NextResponse.json({ success: true, data: parsedData });
        }

        // Si no es JSON, enviarlo como 'improved' para que el frontend lo use directamente
        return NextResponse.json({
            success: true,
            data: {
                improved: textResponse.replace(/^["']|["']$/g, '').trim(),
                raw: textResponse
            }
        });

    } catch (error) {
        console.error('SEO API Error:', error);
        return NextResponse.json(
            { error: 'Error processing SEO request', details: String(error) },
            { status: 500 }
        );
    }
}
