'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useWebContent } from '@/lib/useWebContent';
import VisualGallery from '@/components/VisualGallery';
import ProductCatalog from '@/components/ProductCatalog';

const BentoBlock = ({ block, entryIndex }: { block: any, entryIndex: number }) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const images = block.gallery && block.gallery.length > 0 ? block.gallery : [block.image].filter(Boolean);
  const [spanW, spanH] = (block.span || '4x4').split('x').map((n: string) => parseInt(n) || 1);
  const isText = block.type === 'text' || block.type === 'both';
  const isImage = block.type === 'image' || block.type === 'both' || !block.type;

  const shadowStyles = {
    none: 'none',
    soft: '0 10px 30px rgba(0,0,0,0.3)',
    strong: '0 20px 60px rgba(0,0,0,0.6)',
    neon: `0 0 30px ${block.bgColor}88`
  };

  const zoom = block.transform_zoom || 1;
  const posX = block.transform_posX ?? 50;
  const posY = block.transform_posY ?? 50;
  const aspectRatio = block.transform_aspectRatio || (block.isCircle ? '1/1' : 'auto');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIdx((prev: number) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  const anim = useMemo(() => {
    const type = block.galleryAnimation || 'fade';
    const targetScale = isHovered ? zoom * 1.06 : zoom;
    switch (type) {
      case 'slide-h': return { initial: { opacity: 0, x: '100%' }, animate: { opacity: 1, x: 0, scale: targetScale }, exit: { opacity: 0, x: '-100%' } };
      case 'slide-v': return { initial: { opacity: 0, y: '100%' }, animate: { opacity: 1, y: 0, scale: targetScale }, exit: { opacity: 0, y: '-100%' } };
      case 'zoom': return { initial: { opacity: 0, scale: targetScale * 0.5 }, animate: { opacity: 1, scale: targetScale }, exit: { opacity: 0, scale: targetScale * 1.5 } };
      case 'crossfade': return { initial: { opacity: 0, scale: targetScale }, animate: { opacity: 1, scale: targetScale }, exit: { opacity: 0, scale: targetScale } };
      default: return { initial: { opacity: 0, scale: targetScale * 1.02 }, animate: { opacity: 1, scale: targetScale }, exit: { opacity: 0, scale: targetScale * 0.98 } };
    }
  }, [block.galleryAnimation, zoom, isHovered]);

  return (
    <motion.div
      ref={cardRef}
      layoutId={block.id}
      className="bento-block-mobile"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: (entryIndex % 6) * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        gridColumn: `${block.col} / span ${spanW}`,
        gridRow: `${block.row} / span ${spanH}`,
        zIndex: block.zIndex || 1,
        position: 'relative',
        background: block.gradient ? `linear-gradient(135deg, ${block.bgColor}, ${block.bgColor}dd)` : (block.bgColor || '#111'),
        borderRadius: block.isCircle ? '50%' : (block.borderRadius || '12px'),
        aspectRatio: aspectRatio,
        ...({ '--mobile-aspect': `${spanW} / ${spanH}` } as any),
        boxShadow: isHovered ? (shadowStyles[block.shadow as keyof typeof shadowStyles] || '0 20px 60px rgba(0,0,0,0.5)') : (shadowStyles[block.shadow as keyof typeof shadowStyles] || shadowStyles.none),
        backdropFilter: block.blur ? `blur(${block.blur})` : 'none',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: isText ? '40px' : '0',
        border: isHovered ? `1px solid ${block.borderColor || 'rgba(255,255,255,0.10)'}` : `1px solid ${block.borderColor || 'rgba(255,255,255,0.03)'}`,
        cursor: block.link ? 'pointer' : 'default',
        margin: '4px',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)'
      }}
      whileHover={{ scale: 1.012, y: -4 }}
    >
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10, borderRadius: 'inherit', pointerEvents: 'none',
        background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.055), transparent 45%)`,
        opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease'
      }} />

      {isImage && (
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={`${block.id}-${currentIdx}`}
              initial={anim.initial}
              animate={anim.animate}
              exit={anim.exit}
              transition={{ duration: 0.8 }}
              src={images[currentIdx] || 'https://via.placeholder.com/800x600?text=Ecomoving'}
              style={{
                position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
                objectPosition: `${posX}% ${posY}%`,
                opacity: block.type === 'both' ? 0.4 : 1, zIndex: 1
              }}
              alt={block.label}
            />
          </AnimatePresence>
        </div>
      )}

      {(block.blockTitle || block.blockParagraph) && (
        <div style={{
          position: 'absolute', zIndex: 20, pointerEvents: 'none',
          top: block.textPadding || '30px', left: block.textPadding || '30px',
          right: block.textPadding || '30px', bottom: block.textPadding || '30px',
          display: 'flex', flexDirection: 'column',
          alignItems: block.textAlign === 'center' ? 'center' : (block.textAlign === 'right' ? 'flex-end' : 'flex-start'),
          justifyContent: block.textVerticalAlign || 'flex-start'
        }}>
          {block.blockTitle && (
            <h2 style={{
              margin: '0 0 15px 0', color: block.textColor || '#ffffff',
              fontSize: block.titleSize || '2rem', fontWeight: 700,
              textAlign: block.textAlign || 'left', textShadow: '0 4px 20px rgba(0,0,0,0.6)',
              lineHeight: 1.1, maxWidth: '90%'
            }}>
              {block.blockTitle}
            </h2>
          )}
          {block.blockParagraph && (
            <p style={{
              margin: 0, color: block.textColor ? `${block.textColor}dd` : '#cccccc',
              fontSize: block.paragraphSize || '1rem', fontWeight: 400,
              textAlign: block.textAlign || 'left', maxWidth: '600px',
              textShadow: '0 2px 10px rgba(0,0,0,0.8)', lineHeight: 1.5
            }}>
              {block.blockParagraph}
            </p>
          )}
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

  const { content, loading: contentLoading } = useWebContent();
  const [heroIdx, setHeroIdx] = useState(0);

  const heroImages = useMemo(() => {
    const h = content.hero;
    const imgs = [h.background_image, h.background_image_2, h.background_image_3, ...(h.gallery || [])].filter(Boolean);
    return imgs.length > 0 ? imgs : ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop'];
  }, [content.hero]);

  useEffect(() => {
    if (heroImages.length > 1) {
      const itv = setInterval(() => {
        setHeroIdx(prev => (prev + 1) % heroImages.length);
      }, 6000);
      return () => clearInterval(itv);
    }
  }, [heroImages.length]);

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
              fontFamily: 'var(--font-heading)',
              color: section.titleColor || 'white',
              marginBottom: '30px',
              lineHeight: 1.1,
              position: 'relative',
              display: 'inline-block'
            }}>
              {section.title1}
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
                {section.paragraph1}
              </p>
            </div>
          </motion.div>

          {/* Grilla Maestro 48x48 con resolución micro (15px) */}
          <div className="responsive-grid" style={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(48, 1fr)', 
            gridAutoRows: '15px',
            gap: '0px', 
            position: 'relative', 
            padding: '20px',
            width: '100%',
            backgroundColor: 'transparent',
            overflow: 'visible'
          }}>
            {(() => {
              const allBlocks = (section.blocks as any[]) || [];
              return allBlocks.map((block: any, idx: number) => (
                <BentoBlock
                  key={block.id}
                  block={block}
                  entryIndex={idx}
                />
              ));
            })()}
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
    const array = content.sections || [];
    // Respetamos estrictamente el campo 'order' del CMS o el índice natural del array
    return [...array].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  }, [content.sections]);

  if (contentLoading) return (
    <div style={{ height: '100vh', background: '#000', color: '#00d4bd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', letterSpacing: '15px', fontFamily: 'var(--font-heading)' }}>
      ECOMOVING SPA
    </div>
  );

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

      <nav className='nav-master-public'>
        <div className='logo-brand'>
          <img src="https://xgdmyjzyejjmwdqkufhp.supabase.co/storage/v1/object/public/logo_ecomoving/Logo_horizontal.png" alt="Ecomoving Logo" className="logo-img" />
        </div>
      </nav>

      {/* Hero Section Dinámico */}
      <section className='hero-premium' style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <AnimatePresence mode='wait'>
            <motion.img
              key={heroImages[heroIdx]}
              src={heroImages[heroIdx]}
              alt="Ecomoving Hero"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </AnimatePresence>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 20%, #000 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '1000px', padding: '0 20px' }}>
          <motion.h1
            key={content.hero.title || content.hero.title1}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{ fontSize: 'min(5rem, 10vw)', fontFamily: 'var(--font-heading)', lineHeight: 1.1, marginBottom: '20px', textTransform: 'uppercase' }}
          >
            {content.hero.title || content.hero.title1}
          </motion.h1>
          <motion.p
            key={content.hero.paragraph1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ fontSize: '1.5rem', color: '#888', marginBottom: '40px', letterSpacing: '2px', maxWidth: '800px', marginInline: 'auto' }}
          >
            {content.hero.paragraph1}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <Link
              href={content.hero.cta_link || '/catalogo'}
              className='cta-luxury'
              style={{
                display: 'inline-block',
                padding: '18px 50px',
                background: '#00d4bd',
                color: '#000',
                fontWeight: 900,
                borderRadius: '50px',
                letterSpacing: '2px',
                textDecoration: 'none',
                transition: '0.3s'
              }}
            >
              {content.hero.cta_text || 'VER CATÁLOGO'}
            </Link>
          </motion.div>
        </div>
      </section>

      {(sections as any[]).map((s: any) => renderDynamicSection(s))}

      <footer id="contacto" style={{ padding: '80px 0', textAlign: 'center', borderTop: '1px solid #111', background: '#000' }}>
        <div style={{ marginBottom: '20px' }}>
          <img src="https://xgdmyjzyejjmwdqkufhp.supabase.co/storage/v1/object/public/logo_ecomoving/Logo_horizontal.png" alt="Ecomoving Logo" className="logo-img-footer" />
        </div>
        <div style={{ fontSize: '0.8rem', color: '#555', letterSpacing: '4px', marginBottom: '30px' }}>CHILE &bull; SUSTENTABILIDAD &bull; DISEÑO</div>
        <div style={{ fontSize: '0.7rem', color: '#333' }}>© 2026 TODOS LOS DERECHOS RESERVADOS</div>
      </footer>

    </main>
  );
}
