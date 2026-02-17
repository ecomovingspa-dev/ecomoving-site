'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useWebContent, DynamicSection } from '../lib/useWebContent';
import VisualGallery from '../components/VisualGallery';

export default function Home() {
  const { content, loading } = useWebContent();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', color: '#00d4bd' }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 40, height: 40, border: '2px solid #00d4bd', borderRadius: '50%', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  const renderDynamicSection = (section: DynamicSection) => {
    const sectionAccent = section.titleColor || '#00d4bd';

    return (
      <section
        key={section.id}
        style={{
          padding: '120px 20px',
          backgroundColor: section.bgColor || '#050505',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header de Sección con soporte para múltiples niveles de texto */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: '80px', textAlign: section.descAlign || 'left' }}
          >
            {section.subtitle && (
              <span style={{ color: sectionAccent, fontSize: '11px', fontWeight: 900, letterSpacing: '5px', display: 'block', marginBottom: '20px' }}>
                {section.subtitle.toUpperCase()}
              </span>
            )}

            <h2 style={{
              fontSize: section.titleSize || '4.5rem',
              color: section.titleColor || 'white',
              marginBottom: '30px',
              lineHeight: 1.1
            }}>
              {section.title1 || 'Sin Título'}
            </h2>

            <p style={{
              maxWidth: '800px',
              fontSize: section.descSize || '1.1rem',
              color: section.descColor || '#888',
              lineHeight: 1.8,
              marginBottom: '40px',
              margin: section.descAlign === 'center' ? '0 auto 40px' : '0 0 40px 0'
            }}>
              {section.paragraph1 || 'Sin descripción disponible.'}
            </p>

            {/* Texto Secundario */}
            {(section.title2 || section.paragraph2) && (
              <div style={{ marginTop: '20px', opacity: 0.8 }}>
                {section.title2 && <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{section.title2}</h3>}
                {section.paragraph2 && <p style={{ fontSize: '1rem', color: '#666' }}>{section.paragraph2}</p>}
              </div>
            )}
          </motion.div>

          {/* Grilla de Bloques */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(24, 1fr)',
            gridAutoRows: 'minmax(75px, auto)',
            gap: '15px'
          }}>
            {(section.blocks || []).sort((a: any, b: any) => (a.zIndex || 0) - (b.zIndex || 0)).map((block: any) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                style={{
                  gridColumn: `span ${block.span?.split('x')[0] || 4}`,
                  gridRow: `span ${block.span?.split('x')[1] || 2}`,
                  backgroundColor: block.bgColor || 'rgba(255,255,255,0.03)',
                  borderRadius: block.borderRadius || '24px',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {block.image && (
                  <img src={block.image} alt={block.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}

                {block.textContent && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: block.textAlign || 'center',
                    background: block.image ? 'rgba(0,0,0,0.3)' : 'transparent',
                    color: block.textColor || 'white'
                  }}>
                    <span style={{ fontSize: block.fontSize || '1rem', fontWeight: 600 }}>{block.textContent}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {section.gallery && section.gallery.length > 0 && (
            <VisualGallery images={section.gallery} accentColor={sectionAccent} />
          )}
        </div>
      </section>
    );
  };

  const sortedSections = [...(content.sections || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <main style={{ backgroundColor: '#050505', color: 'white' }}>
      {/* Hero */}
      <section style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src={content.hero.background_image} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #050505)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 20px', maxWidth: '1000px' }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: '5rem', fontWeight: 900, marginBottom: '20px', lineHeight: 1 }}>
            {content.hero.title1}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ fontSize: '1.4rem', color: '#aaa', marginBottom: '40px' }}>
            {content.hero.paragraph1}
          </motion.p>
          <Link href={content.hero.cta_link} style={{ padding: '20px 50px', background: '#00d4bd', color: '#000', fontWeight: 900, borderRadius: '50px', textDecoration: 'none', letterSpacing: '2px' }}>
            {content.hero.cta_text}
          </Link>
        </div>
      </section>

      {sortedSections.map(renderDynamicSection)}

      <footer style={{ padding: '80px 20px', textAlign: 'center', borderTop: '1px solid #111' }}>
        <p style={{ color: '#444', fontSize: '11px', letterSpacing: '4px' }}>ECOMOVING © 2026 | SUSTAINABLE LUXURY</p>
      </footer>
    </main>
  );
}
