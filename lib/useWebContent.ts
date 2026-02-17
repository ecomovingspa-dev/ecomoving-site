'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';

export interface HeroContent {
    title1: string;
    paragraph1: string;
    cta_text: string;
    cta_link: string;
    background_image: string;
    background_image_2?: string;
    background_image_3?: string;
    alt_text?: string;
    meta_title?: string;
    gallery?: string[];
    drive_folder_id?: string;
}

export interface LayoutBlock {
    id: string;
    label: string;
    type?: 'image' | 'text' | 'both';
    image?: string;
    textContent?: string;
    bgColor?: string;
    textColor?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    span: string;
    col: number;
    row: number;
    zIndex: number;
    alt_text?: string;
    borderRadius?: string;
    fontSize?: string;
}

export interface DynamicSection {
    id: string;
    order: number;
    subtitle?: string;
    title1: string;
    paragraph1: string;
    title2?: string;
    paragraph2?: string;
    blocks: LayoutBlock[];
    bgColor: string;
    titleColor?: string;
    titleSize?: string;
    descColor?: string;
    descSize?: string;
    descAlign?: 'left' | 'center' | 'right' | 'justify';
    gallery?: string[];
}

export interface WebContent {
    hero: HeroContent;
    sections: DynamicSection[];
    [key: string]: any;
}

const defaultContent: WebContent = {
    hero: {
        title1: 'ECOMOVING: MERCHANDISING SUSTENTABLE',
        paragraph1: 'Elevamos tu marca con conciencia ecológica.',
        cta_text: 'EXPLORAR CATÁLOGO',
        cta_link: '/catalogo',
        background_image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop',
    },
    sections: []
};

export function useWebContent() {
    const [content, setContent] = useState<WebContent>(defaultContent);
    const [loading, setLoading] = useState(true);

    const fetchContent = useCallback(async () => {
        try {
            const { data, error: fetchError } = await supabase
                .from('web_contenido')
                .select('section, content');

            if (fetchError) throw fetchError;

            if (data && data.length > 0) {
                const newContent: WebContent = { ...defaultContent };
                const extraSections: Record<string, any> = {};

                data.forEach((row) => {
                    const sectionName = row.section;
                    let rawContent = row.content as any;

                    // Mapeo inteligente de campos antiguos a nuevos
                    if (rawContent) {
                        if (rawContent.title && !rawContent.title1) rawContent.title1 = rawContent.title;
                        if (rawContent.description && !rawContent.paragraph1) rawContent.paragraph1 = rawContent.description;
                        if (rawContent.title_2 && !rawContent.title2) rawContent.title2 = rawContent.title_2;
                        if (rawContent.description_2 && !rawContent.paragraph2) rawContent.paragraph2 = rawContent.description_2;
                        if (rawContent.subtitle && sectionName === 'hero' && !rawContent.paragraph1) rawContent.paragraph1 = rawContent.subtitle;
                    }

                    if (sectionName === 'hero') {
                        newContent.hero = { ...newContent.hero, ...rawContent };
                    } else if (sectionName === 'sections') {
                        const sectionsArray = Array.isArray(rawContent) ? rawContent : Object.values(rawContent);
                        newContent.sections = sectionsArray.map((s: any) => ({
                            ...s,
                            title1: s.title1 || s.title || '',
                            paragraph1: s.paragraph1 || s.description || '',
                            title2: s.title2 || s.title_2 || '',
                            paragraph2: s.paragraph2 || s.description_2 || ''
                        }));
                    } else {
                        newContent[sectionName.toLowerCase()] = rawContent;
                        extraSections[sectionName.toLowerCase()] = rawContent;
                    }
                });

                // Sincronizar galerías
                if (newContent.sections.length > 0) {
                    newContent.sections = newContent.sections.map(s => {
                        const titleLower = (s.title1 || '').toLowerCase();
                        const foundKey = Object.keys(extraSections).find(key => titleLower.includes(key));
                        if (foundKey && extraSections[foundKey].gallery) {
                            return { ...s, gallery: extraSections[foundKey].gallery };
                        }
                        return s;
                    });
                }

                setContent(newContent);
            }
        } catch (err) {
            console.error('Error fetching web content:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    return { content, loading };
}
