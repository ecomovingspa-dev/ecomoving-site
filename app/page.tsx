'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useWebContent, DynamicSection, WebContent } from '../lib/useWebContent';
import VisualGallery from '../components/VisualGallery';

const BentoBlock = ({ block, assets }: {
  block: any,
  assets: any
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const images = block.gallery && block.gallery.length > 0 ? block.gallery : [block.image].filter(Boolean);
  const [spanW, spanH] = (block.span || '4x1').split('x').map((n: string) => parseInt(n) || 1);
  const isText = block.type === 'text' || block.type === 'both';
  const isImage = block.type === 'image' || block.type === 'both' || !block.type;

  const shadowStyles = {
    none: 'none',
    soft: '0 10px 30px rgba(0,0,0,0.3)',
    strong: '0 20px 60px rgba(0,0,0,0.6)',
    neon: `0 0 30px ${block.bgColor}88`
  };

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIdx((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      style={{
        gridColumn: `${block.col} / span ${spanW}`,
        gridRow: `${block.row} / span ${spanH}`,
        zIndex: block.zIndex || 1,
        position: 'relative',
        background: block.gradient
          ? `linear-gradient(135deg, ${block.bgColor}, ${block.bgColor}dd)`
          : (block.bgColor || '#111'),
        borderRadius: block.isCircle ? '50%' : (block.borderRadius || '32px'),
        aspectRatio: block.isCircle ? '1/1' : 'auto',
        boxShadow: shadowStyles[block.shadow as keyof typeof shadowStyles] || shadowStyles.none,
        backdropFilter: block.blur ? `blur(${block.blur})` : 'none',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: isText ? '40px' : '0',
        border: block.borderColor ? `1px solid ${block.borderColor}` : 'none',
        cursor: block.link ? 'pointer' : 'default'
      }}
    >
      {isImage && (
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={`${block.id}-${currentIdx}`}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              src={assets[block.id] || images[currentIdx] || 'https://via.placeholder.com/800x600?text=Ecomoving'}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                opacity: block.type === 'both' ? 0.4 : 1,
                zIndex: 1
              }}
            />
          </AnimatePresence>
        </div>
      )}

      {isText && (
        <div style={{
          zIndex: 2, color: block.textColor || '#fff',
          textAlign: block.textAlign || 'center',
          fontSize: block.fontSize || '1.4rem',
          fontWeight: 800, width: '100%',
          textShadow: '0 2px 15px rgba(0,0,0,0.5)',
          writingMode: block.writingMode || 'horizontal-tb',
          transform: block.writingMode && block.writingMode !== 'horizontal-tb' ? 'rotate(180deg)' : 'none',
          padding: '20px'
        }}>
          {block.textContent}
        </div>
      )}
    </motion.div>
  );
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const { content, loading } = useWebContent();

  const renderDynamicSection = (section: any) => {
    const sectionAccent = section.blocks?.find((b: any) => b.bgColor)?.bgColor || section.titleColor || '#00d4bd';

    return (
      <section key={section.id} id={section.id} style={{ background: section.bgColor || '#000', padding: '120px 0', overflow: 'hidden' }}>
        <div className='container'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            style={{ marginBottom: '80px' }}
          >
            <h2 className='editorial-title' style={{
              fontSize: section.titleSize || '4.5rem',
              color: section.titleColor || 'white',
              marginBottom: '30px',
              lineHeight: 1.1,
              position: 'relative',
              display: 'inline-block'
            }}>
              {section.title1 || (section as any).title}
              <div style={{
                position: 'absolute',
                bottom: '-15px',
                left: 0,
                width: '240px',
                height: '6px',
                background: `linear-gradient(to right, ${sectionAccent}, transparent)`,
                borderRadius: '3px'
              }} />
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', gap: '12px', marginTop: '40px' }}>
              <p style={{
                gridColumn: `${section.descCol || 1} / span ${section.descSpan || 12}`,
                color: section.descColor || '#888',
                fontSize: section.descSize || '1.2rem',
                textAlign: section.descAlign || 'left',
                lineHeight: 1.8,
                transition: 'all 0.5s ease'
              }}>
                {section.paragraph1 || (section as any).description}
              </p>

              {section.title2 && (
                <h3 style={{
                  gridColumn: '1 / span 24',
                  fontSize: '1.5rem',
                  color: section.titleColor || 'white',
                  marginTop: '40px',
                  marginBottom: '15px',
                  opacity: 0.9
                }}>
                  {section.title2}
                </h3>
              )}
              {section.paragraph2 && (
                <p style={{
                  gridColumn: '1 / span 24',
                  maxWidth: '700px',
                  fontSize: '1.1rem',
                  color: section.descColor || '#666',
                  lineHeight: 1.6
                }}>
                  {section.paragraph2}
                </p>
              )}
            </div>
          </motion.div>

          {/* Grilla Maestro 24x4 */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', gridAutoRows: 'minmax(75px, auto)',
            gap: '10px', position: 'relative', padding: '20px',
            minHeight: '620px', marginBottom: '80px'
          }}>
            {(section.blocks || []).map((block: any) => (
              <BentoBlock
                key={block.id}
                block={block}
                assets={{}}
              />
            ))}
          </div>

          <VisualGallery
            images={section.gallery}
            accentColor={sectionAccent}
          />
        </div>
      </section>
    );
  };

  const sections = useMemo(() => {
    const raw = content.sections;
    const array = Array.isArray(raw) ? raw : (typeof raw === 'object' ? Object.values(raw) : []);

    const categoryOrder = [
      'ECOLOGICOS',
      'BOTELLAS, MUG Y TAZAS',
      'CUADERNOS, LIBRETAS Y MEMO SET',
      'MOCHILAS, BOLSOS Y MORRALES',
      'BOLÍGRAFOS',
      'ACCESORIOS'
    ];

    return [...array].sort((a: any, b: any) => {
      const titleA = (a.title1 || (a as any).title || '').toUpperCase();
      const titleB = (b.title1 || (b as any).title || '').toUpperCase();

      const indexA = categoryOrder.findIndex(cat => titleA.includes(cat));
      const indexB = categoryOrder.findIndex(cat => titleB.includes(cat));

      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      return (a.order || 0) - (b.order || 0);
    });
  }, [content.sections]);

  if (loading) return <div style={{ height: '100vh', background: '#000', color: '#00d4bd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', letterSpacing: '15px', fontFamily: 'var(--font-heading)' }}>ECOMOVING SPA</div>;

  return (
    <main style={{ backgroundColor: '#050505', color: 'white', minHeight: '100vh' }}>
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '4px',
          background: 'linear-gradient(to right, #00d4bd, #efb810)',
          transformOrigin: '0%', zIndex: 2000,
          scaleX
        }}
      />

      <nav className='nav-master'>
        <div className='logo-brand'>
          <img src="https://xgdmyjzyejjmwdqkufhp.supabase.co/storage/v1/object/public/logo_ecomoving/Logo_horizontal.png" alt="Ecomoving Logo" className="logo-img" />
        </div>
        <div className='nav-links' style={{ display: 'flex', gap: '30px' }}>
          <Link href="/catalogo" className='nav-item'>CATÁLOGO</Link>
          <Link href="/#nosotros" className='nav-item'>NOSOTROS</Link>
          <Link href="/#contacto" className='nav-item'>CONTACTO</Link>
        </div>
      </nav>

      <section className='hero-premium' style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src={content.hero.background_image} alt="Ecomoving" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 20%, #000 100%)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '1000px', padding: '0 20px' }}>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{ fontSize: '5rem', fontFamily: 'var(--font-heading)', lineHeight: 1, marginBottom: '20px' }}
          >
            {content.hero.title1}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ fontSize: '1.5rem', color: '#888', marginBottom: '40px', letterSpacing: '2px' }}
          >
            {content.hero.paragraph1}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <Link href={content.hero.cta_link} className='cta-luxury' style={{ display: 'inline-block', padding: '15px 40px', background: '#00d4bd', color: '#000', fontWeight: 900, borderRadius: '50px', letterSpacing: '2px', textDecoration: 'none' }}>
              {content.hero.cta_text}
            </Link>
          </motion.div>
        </div>
      </section>

      {sections.map(s => renderDynamicSection(s))}

      <footer style={{ padding: '80px 0', textAlign: 'center', borderTop: '1px solid #111', background: '#000' }}>
        <div style={{ marginBottom: '20px' }}>
          <img src="https://xgdmyjzyejjmwdqkufhp.supabase.co/storage/v1/object/public/logo_ecomoving/Logo_horizontal.png" alt="Ecomoving Logo" style={{ height: '50px' }} />
        </div>
        <div style={{ fontSize: '0.8rem', color: '#555', letterSpacing: '4px', marginBottom: '30px' }}>CHILE &bull; SUSTENTABILIDAD &bull; DISEÑO</div>
        <div style={{ fontSize: '0.7rem', color: '#333' }}>© 2026 TODOS LOS DERECHOS RESERVADOS</div>
      </footer>
    </main>
  );
}
