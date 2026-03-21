'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Loader2, CheckCircle, XCircle, AlertTriangle, Sparkles, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

// ── Tipos ──────────────────────────────────────────────────────────────────────

interface WebContent {
    id: number;
    section: string;
    content: Record<string, unknown>;
    updated_at: string;
}

interface CheckResult {
    id: string;
    label: string;
    status: 'pass' | 'warn' | 'fail';
    detail: string;
    section: string; // 'hero' | 'grilla' | 'bloques'
}

interface AISEOReport {
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
}

interface LandingAuditorProps {
    webContent: WebContent[];
    onFetchSeoApi: (payload: Record<string, unknown>) => Promise<{ success: boolean; data?: AISEOReport }>;
}

// ── Utilidades de checks automáticos ──────────────────────────────────────────

function runAutoChecks(webContent: WebContent[]): CheckResult[] {
    const checks: CheckResult[] = [];
    const heroRaw = webContent.find(s => s.section === 'hero')?.content || {};
    const sectionsRaw = webContent.find(s => s.section === 'sections')?.content;

    // Convertimos content a strings simples
    const hero: Record<string, string> = {};
    Object.entries(heroRaw).forEach(([k, v]) => { if (typeof v === 'string') hero[k] = v; });

    // ── HERO ──────────────────────────────────────────────────────────────────

    // H1 / title1
    const h1 = hero['title1'] || '';
    if (!h1.trim()) {
        checks.push({ id: 'h1-missing', label: 'H1 (Título Principal)', status: 'fail', detail: 'El Hero no tiene título. Google no puede identificar el tema de la página.', section: 'Hero' });
    } else if (h1.split(' ').length < 3) {
        checks.push({ id: 'h1-short', label: 'H1 demasiado corto', status: 'warn', detail: `"${h1}" — muy breve. Apunta a 5-9 palabras con la keyword principal.`, section: 'Hero' });
    } else if (h1.split(' ').length > 12) {
        checks.push({ id: 'h1-long', label: 'H1 demasiado largo', status: 'warn', detail: `"${h1.substring(0, 60)}..." — ${h1.split(' ').length} palabras. Reduce a 5-9 para mayor impacto.`, section: 'Hero' });
    } else {
        checks.push({ id: 'h1-ok', label: 'H1 presente y bien dimensionado', status: 'pass', detail: `"${h1.substring(0, 60)}" — longitud óptima.`, section: 'Hero' });
    }

    // Keywords eco/sustentable en H1
    const ecoKw = ['eco', 'sustent', 'verde', 'ecológ', 'sostenib', 'corporat', 'merchandis', 'personaliz'];
    const h1Lower = h1.toLowerCase();
    const hasKw = ecoKw.some(kw => h1Lower.includes(kw));
    if (h1.trim() && !hasKw) {
        checks.push({ id: 'h1-kw', label: 'Keyword estratégica ausente en H1', status: 'warn', detail: 'El H1 no contiene palabras clave de posicionamiento (ej: "ecológico", "corporativo", "merchandising").', section: 'Hero' });
    } else if (h1.trim() && hasKw) {
        checks.push({ id: 'h1-kw-ok', label: 'Keyword estratégica en H1', status: 'pass', detail: 'El H1 incluye al menos una keyword de posicionamiento.', section: 'Hero' });
    }

    // Párrafo bajada
    const p1 = hero['paragraph1'] || '';
    if (!p1.trim()) {
        checks.push({ id: 'p1-missing', label: 'Bajada del Hero vacía', status: 'fail', detail: 'El párrafo de descripción del Hero está vacío. Afecta a crawlers y tiempo de permanencia.', section: 'Hero' });
    } else if (p1.split(' ').length < 10) {
        checks.push({ id: 'p1-short', label: 'Bajada del Hero muy corta', status: 'warn', detail: `Solo ${p1.split(' ').length} palabras. Apunta a 20-35 palabras con propuesta de valor clara.`, section: 'Hero' });
    } else {
        checks.push({ id: 'p1-ok', label: 'Bajada del Hero presente', status: 'pass', detail: `${p1.split(' ').length} palabras — longitud adecuada.`, section: 'Hero' });
    }

    // CTA
    const cta = hero['cta_text'] || '';
    if (!cta.trim()) {
        checks.push({ id: 'cta-missing', label: 'CTA del Hero ausente', status: 'fail', detail: 'Sin botón de acción principal. Afecta tasa de conversión y señales de engagement.', section: 'Hero' });
    } else if (cta.split(' ').length > 5) {
        checks.push({ id: 'cta-long', label: 'CTA demasiado largo', status: 'warn', detail: `"${cta}" — ${cta.split(' ').length} palabras. Los CTAs efectivos tienen 2-3 palabras máximo.`, section: 'Hero' });
    } else {
        checks.push({ id: 'cta-ok', label: 'CTA del Hero presente', status: 'pass', detail: `"${cta}" — longitud óptima.`, section: 'Hero' });
    }

    // Alt text imagen Hero
    const altText = hero['alt_text'] || '';
    if (!altText.trim()) {
        checks.push({ id: 'alt-missing', label: 'Alt-text de imagen Hero vacío', status: 'warn', detail: 'Google Images no puede indexar la imagen del Hero sin alt-text descriptivo.', section: 'Hero' });
    } else {
        checks.push({ id: 'alt-ok', label: 'Alt-text de imagen presente', status: 'pass', detail: `"${altText.substring(0, 60)}"`, section: 'Hero' });
    }

    // Meta title
    const metaTitle = hero['meta_title'] || '';
    if (!metaTitle.trim()) {
        checks.push({ id: 'meta-missing', label: 'Meta Title vacío', status: 'fail', detail: 'Sin Meta Title Google usa el H1 por defecto. Considera añadirlo para control total del SERP.', section: 'Hero' });
    } else if (metaTitle.length > 60) {
        checks.push({ id: 'meta-long', label: 'Meta Title demasiado largo', status: 'warn', detail: `${metaTitle.length} caracteres. Google muestra ~60 caracteres; el resto se trunca en el resultado de búsqueda.`, section: 'Hero' });
    } else {
        checks.push({ id: 'meta-ok', label: 'Meta Title óptimo', status: 'pass', detail: `${metaTitle.length} caracteres — dentro del rango ideal (50-60).`, section: 'Hero' });
    }

    // ── SECCIONES DINÁMICAS / GRILLA ────────────────────────────────────────

    const sections = Array.isArray(sectionsRaw) ? (sectionsRaw as any[]) : [];

    if (sections.length === 0) {
        checks.push({ id: 'grilla-empty', label: 'Grilla sin secciones configuradas', status: 'warn', detail: 'No se encontraron secciones dinámicas. La landing podría carecer de contenido para rastreo.', section: 'Grilla' });
    } else {
        checks.push({ id: 'grilla-count', label: `${sections.length} sección(es) en la grilla`, status: 'pass', detail: 'La grilla tiene contenido estructurado. Buena señal para el rastreo.', section: 'Grilla' });

        let blocksWithoutText = 0;
        let blocksWithImages = 0;
        let totalBlocks = 0;

        sections.forEach((sec: any) => {
            // Verifica título de la sección
            if (!sec.title1?.trim()) {
                checks.push({ id: `sec-notitle-${sec.id}`, label: `Sección sin título`, status: 'warn', detail: `Una sección de la grilla no tiene título configurado. ID: ${sec.id?.substring(0, 8) || '?'}`, section: 'Secciones' });
            }
            // Párrafo de la sección
            if (!sec.paragraph1?.trim()) {
                checks.push({ id: `sec-nopara-${sec.id}`, label: `Sección sin párrafo`, status: 'warn', detail: `Sección "${sec.title1 || sec.id?.substring(0, 8) || '?'}" sin descripción. Google prefiere contenido textual en cada bloque.`, section: 'Secciones' });
            }

            // Bloques internos
            const blocks: any[] = sec.blocks || [];
            totalBlocks += blocks.length;
            blocks.forEach((b: any) => {
                if (b.type === 'image' || b.type === 'both') blocksWithImages++;
                if (!b.textContent?.trim() && !b.blockTitle?.trim() && (b.type === 'text' || b.type === 'both')) blocksWithoutText++;
            });
        });

        if (blocksWithoutText > 0) {
            checks.push({ id: 'blocks-empty-text', label: `${blocksWithoutText} bloque(s) de texto vacíos`, status: 'warn', detail: 'Bloques tipo "texto" sin contenido. Rellénelos para mejorar densidad de keywords.', section: 'Bloques' });
        }
        if (totalBlocks > 0) {
            checks.push({ id: 'blocks-total', label: `${totalBlocks} bloques de contenido`, status: 'pass', detail: `${blocksWithImages} con imagen, ${totalBlocks - blocksWithImages} de texto/mixtos.`, section: 'Bloques' });
        }
    }

    return checks;
}

// ── Score automático (sin IA) ─────────────────────────────────────────────────

function computeAutoScore(checks: CheckResult[]): number {
    if (checks.length === 0) return 0;
    const weights = { pass: 3, warn: 1, fail: 0 };
    const maxScore = checks.length * weights.pass;
    const obtained = checks.reduce((acc, c) => acc + weights[c.status], 0);
    return Math.round((obtained / maxScore) * 100);
}

// ── Componente principal ───────────────────────────────────────────────────────

export default function LandingAuditor({ webContent, onFetchSeoApi }: LandingAuditorProps) {
    const [checks, setChecks] = useState<CheckResult[]>([]);
    const [autoScore, setAutoScore] = useState<number | null>(null);
    const [aiReport, setAiReport] = useState<AISEOReport | null>(null);
    const [running, setRunning] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [expandedSection, setExpandedSection] = useState<string | null>('Hero');
    const [step, setStep] = useState<'idle' | 'checks' | 'ai'>('idle');

    const runAudit = async () => {
        setRunning(true);
        setChecks([]);
        setAutoScore(null);
        setAiReport(null);
        setStep('checks');

        // 1. Checks automáticos (instantáneo)
        await new Promise(r => setTimeout(r, 400)); // micro-delay para UX
        const results = runAutoChecks(webContent);
        const score = computeAutoScore(results);
        setChecks(results);
        setAutoScore(score);
        setRunning(false);

        // 2. Análisis IA en paralelo
        setAiLoading(true);
        setStep('ai');
        try {
            const heroContent = webContent.find(s => s.section === 'hero')?.content || {};
            const sectionsContent = webContent.find(s => s.section === 'sections')?.content;

            const allText = [
                ...Object.values(heroContent).filter(v => typeof v === 'string'),
                ...(Array.isArray(sectionsContent)
                    ? (sectionsContent as any[]).flatMap((s: any) => [s.title1, s.paragraph1, s.title2, s.paragraph2].filter(Boolean))
                    : [])
            ].join(' . ').substring(0, 3000);

            const failCount = results.filter(c => c.status === 'fail').length;
            const warnCount = results.filter(c => c.status === 'warn').length;

            const res = await onFetchSeoApi({
                action: 'analyze',
                text: allText,
                section: 'landing_completa',
                context: `Eres un Especialista SEO de Élite para Ecomoving, empresa chilena de merchandising corporativo ecológico premium.
Analiza el contenido COMPLETO de la landing page.
Checks automáticos ya detectaron: ${failCount} errores críticos, ${warnCount} advertencias.
Score automático preliminar: ${score}/100.
IMPORTANTE: Devuelve un análisis semántico-SEO honesto y específico. 
No repitas los checks automáticos. Enfócate en:
1. Coherencia semántica del mensaje de marca
2. Densidad y variedad de keywords
3. Tono y persuasión del copywriting
4. Diferenciación vs. competidores genéricos
5. Oportunidades de mejora no detectadas por reglas simples
Responde con score (0-100), strengths (array), weaknesses (array), suggestions (array).`
            });

            if (res.success && res.data) {
                setAiReport(res.data);
            }
        } catch (e) {
            console.error('[LandingAuditor] Error IA:', e);
        } finally {
            setAiLoading(false);
            setStep('checks');
        }
    };

    const groupedChecks = checks.reduce<Record<string, CheckResult[]>>((acc, c) => {
        if (!acc[c.section]) acc[c.section] = [];
        acc[c.section].push(c);
        return acc;
    }, {});

    const failCount = checks.filter(c => c.status === 'fail').length;
    const warnCount = checks.filter(c => c.status === 'warn').length;
    const passCount = checks.filter(c => c.status === 'pass').length;

    const scoreColor = autoScore !== null
        ? autoScore >= 75 ? '#00d4bd' : autoScore >= 50 ? '#d4af37' : '#ef4444'
        : '#555';

    const StatusIcon = ({ status }: { status: CheckResult['status'] }) => {
        if (status === 'pass') return <CheckCircle size={14} style={{ color: '#00d4bd', flexShrink: 0 }} />;
        if (status === 'warn') return <AlertTriangle size={14} style={{ color: '#d4af37', flexShrink: 0 }} />;
        return <XCircle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

            {/* ── Botón principal ── */}
            <button
                onClick={runAudit}
                disabled={running || aiLoading}
                style={{
                    width: '100%', padding: '15px',
                    background: (running || aiLoading) ? 'rgba(0,212,189,0.08)' : 'linear-gradient(90deg,rgba(0,212,189,0.15),rgba(212,175,55,0.1))',
                    border: '1px solid rgba(0,212,189,0.3)', color: '#00d4bd',
                    borderRadius: '10px', cursor: (running || aiLoading) ? 'wait' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px',
                    marginBottom: '20px', transition: 'all 0.2s'
                }}
            >
                {running ? (
                    <><Loader2 size={15} className="animate-spin" /> EJECUTANDO CHECKS...</>
                ) : aiLoading ? (
                    <><Loader2 size={15} className="animate-spin" /> ANALIZANDO CON IA...</>
                ) : checks.length > 0 ? (
                    <><RefreshCw size={15} /> RE-AUDITAR LANDING</>
                ) : (
                    <><BarChart3 size={15} /> AUDITAR LANDING COMPLETA</>
                )}
            </button>

            {/* ── Progreso ── */}
            {(running || aiLoading) && (
                <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '10px', color: '#555', fontFamily: 'monospace' }}>
                    {running && '▶ Ejecutando checks automáticos (Hero, Grilla, Bloques)...'}
                    {aiLoading && '▶ Análisis semántico-SEO con IA en proceso...'}
                </div>
            )}

            {/* ── Score global ── */}
            <AnimatePresence>
                {autoScore !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: 'rgba(0,0,0,0.4)', border: `1px solid ${scoreColor}33`,
                            borderRadius: '12px', padding: '20px', marginBottom: '20px',
                            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', textAlign: 'center'
                        }}
                    >
                        {/* Score */}
                        <div style={{ gridColumn: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ fontSize: '46px', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{autoScore}</div>
                            <div style={{ fontSize: '8px', color: '#555', letterSpacing: '1px', marginTop: '4px' }}>SCORE</div>
                        </div>
                        {/* Counters */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                            <div style={{ fontSize: '22px', fontWeight: 800, color: '#00d4bd' }}>{passCount}</div>
                            <div style={{ fontSize: '8px', color: '#555', letterSpacing: '1px' }}>OK</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                            <div style={{ fontSize: '22px', fontWeight: 800, color: '#d4af37' }}>{warnCount}</div>
                            <div style={{ fontSize: '8px', color: '#555', letterSpacing: '1px' }}>AVISOS</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                            <div style={{ fontSize: '22px', fontWeight: 800, color: '#ef4444' }}>{failCount}</div>
                            <div style={{ fontSize: '8px', color: '#555', letterSpacing: '1px' }}>ERRORES</div>
                        </div>
                        {/* Barra de progreso */}
                        <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
                            <div style={{ height: '4px', background: '#111', borderRadius: '4px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${autoScore}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    style={{ height: '100%', background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}88)`, borderRadius: '4px' }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Checks por sección ── */}
            <AnimatePresence>
                {Object.entries(groupedChecks).map(([section, sectionChecks]) => (
                    <motion.div
                        key={section}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginBottom: '10px', border: '1px solid #1a1a1a', borderRadius: '10px', overflow: 'hidden' }}
                    >
                        {/* Header de sección */}
                        <button
                            onClick={() => setExpandedSection(expandedSection === section ? null : section)}
                            style={{
                                width: '100%', padding: '11px 14px', background: '#0a0a0a',
                                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '10px', fontWeight: 800, color: '#888', letterSpacing: '1px' }}>{section.toUpperCase()}</span>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {sectionChecks.filter(c => c.status === 'fail').length > 0 && (
                                        <span style={{ fontSize: '9px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '1px 6px', borderRadius: '20px', fontWeight: 700 }}>
                                            {sectionChecks.filter(c => c.status === 'fail').length} error
                                        </span>
                                    )}
                                    {sectionChecks.filter(c => c.status === 'warn').length > 0 && (
                                        <span style={{ fontSize: '9px', background: 'rgba(212,175,55,0.15)', color: '#d4af37', padding: '1px 6px', borderRadius: '20px', fontWeight: 700 }}>
                                            {sectionChecks.filter(c => c.status === 'warn').length} aviso
                                        </span>
                                    )}
                                    {sectionChecks.filter(c => c.status === 'pass').length > 0 && (
                                        <span style={{ fontSize: '9px', background: 'rgba(0,212,189,0.1)', color: '#00d4bd', padding: '1px 6px', borderRadius: '20px', fontWeight: 700 }}>
                                            {sectionChecks.filter(c => c.status === 'pass').length} ok
                                        </span>
                                    )}
                                </div>
                            </div>
                            {expandedSection === section ? <ChevronUp size={13} style={{ color: '#555' }} /> : <ChevronDown size={13} style={{ color: '#555' }} />}
                        </button>

                        {/* Checks */}
                        <AnimatePresence>
                            {expandedSection === section && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    {sectionChecks.map((c, i) => (
                                        <div key={c.id} style={{
                                            padding: '10px 14px', borderTop: '1px solid #111',
                                            display: 'flex', gap: '10px', alignItems: 'flex-start',
                                            background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'
                                        }}>
                                            <StatusIcon status={c.status} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '10px', fontWeight: 700, color: '#ccc', marginBottom: '2px' }}>{c.label}</div>
                                                <div style={{ fontSize: '10px', color: '#555', lineHeight: 1.5 }}>{c.detail}</div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* ── Análisis IA ── */}
            <AnimatePresence>
                {aiLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            marginTop: '8px', padding: '20px', borderRadius: '10px',
                            border: '1px dashed #222', textAlign: 'center', color: '#444'
                        }}
                    >
                        <Sparkles size={20} style={{ margin: '0 auto 10px', color: '#d4af37', opacity: 0.6, display: 'block' }} />
                        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px' }}>ANALIZANDO SEMÁNTICA CON IA...</div>
                        <div style={{ fontSize: '9px', marginTop: '4px' }}>Evaluando coherencia, keywords y copywriting</div>
                    </motion.div>
                )}

                {aiReport && !aiLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginTop: '8px' }}
                    >
                        {/* Header IA */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', padding: '10px 14px', background: 'rgba(212,175,55,0.06)', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.15)' }}>
                            <Sparkles size={14} style={{ color: '#d4af37' }} />
                            <span style={{ fontSize: '10px', fontWeight: 800, color: '#d4af37', letterSpacing: '1px' }}>ANÁLISIS SEMÁNTICO IA</span>
                            <div style={{ marginLeft: 'auto', fontSize: '18px', fontWeight: 900, color: aiReport.score >= 75 ? '#00d4bd' : aiReport.score >= 50 ? '#d4af37' : '#ef4444' }}>
                                {aiReport.score}<span style={{ fontSize: '9px', color: '#555' }}>/100</span>
                            </div>
                        </div>

                        {/* Fortalezas */}
                        {aiReport.strengths?.length > 0 && (
                            <div style={{ marginBottom: '12px', padding: '12px 14px', background: 'rgba(0,212,189,0.04)', borderRadius: '8px', borderLeft: '3px solid #00d4bd33' }}>
                                <div style={{ fontSize: '9px', color: '#00d4bd', fontWeight: 800, letterSpacing: '1px', marginBottom: '8px' }}>✓ FORTALEZAS</div>
                                {aiReport.strengths.map((s, i) => (
                                    <div key={i} style={{ fontSize: '11px', color: '#aaa', marginBottom: '4px', lineHeight: 1.5 }}>• {s}</div>
                                ))}
                            </div>
                        )}

                        {/* Debilidades */}
                        {aiReport.weaknesses?.length > 0 && (
                            <div style={{ marginBottom: '12px', padding: '12px 14px', background: 'rgba(239,68,68,0.04)', borderRadius: '8px', borderLeft: '3px solid #ef444433' }}>
                                <div style={{ fontSize: '9px', color: '#ef4444', fontWeight: 800, letterSpacing: '1px', marginBottom: '8px' }}>✗ DEBILIDADES</div>
                                {aiReport.weaknesses.map((w, i) => (
                                    <div key={i} style={{ fontSize: '11px', color: '#aaa', marginBottom: '4px', lineHeight: 1.5 }}>• {w}</div>
                                ))}
                            </div>
                        )}

                        {/* Sugerencias */}
                        {aiReport.suggestions?.length > 0 && (
                            <div style={{ padding: '12px 14px', background: 'rgba(212,175,55,0.04)', borderRadius: '8px', borderLeft: '3px solid #d4af3733' }}>
                                <div style={{ fontSize: '9px', color: '#d4af37', fontWeight: 800, letterSpacing: '1px', marginBottom: '8px' }}>💡 RECOMENDACIONES PRIORITARIAS</div>
                                {aiReport.suggestions.map((s, i) => (
                                    <div key={i} style={{ fontSize: '11px', color: '#aaa', marginBottom: '6px', lineHeight: 1.5, display: 'flex', gap: '6px' }}>
                                        <span style={{ color: '#d4af37', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                                        <span>{s}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Estado inicial ── */}
            {checks.length === 0 && !running && !aiLoading && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#333' }}>
                    <BarChart3 size={42} style={{ margin: '0 auto 14px', opacity: 0.15, display: 'block' }} />
                    <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', marginBottom: '6px' }}>AUDITOR SEO — LANDING PAGE</p>
                    <p style={{ fontSize: '10px', color: '#2a2a2a', lineHeight: 1.7 }}>
                        Analiza Hero, Secciones y Bloques<br />
                        con checks automáticos + análisis IA
                    </p>
                </div>
            )}
        </div>
    );
}
