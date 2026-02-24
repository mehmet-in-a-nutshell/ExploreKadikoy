import { supabase } from '../../../utils/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 60;

export default async function GuideDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = params;

    const { data: guide } = await supabase
        .from('guides')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!guide) {
        notFound();
    }

    return (
        <main style={{ minHeight: '100vh', padding: '6rem 2rem 2rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
            {/* Back Button */}
            <Link href="/rehber" style={{ display: 'inline-block', marginBottom: '2rem', color: '#a1a1aa', textDecoration: 'none', transition: 'color 0.2s' }}>
                &larr; Tüm Rehberlere Dön
            </Link>

            {/* Header Info */}
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <span style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                        Şehir Rehberi
                    </span>
                    {guide.read_time && (
                        <span style={{ backgroundColor: '#27272a', color: '#e4e4e7', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem' }}>
                            ⏱ {guide.read_time} dk okuma
                        </span>
                    )}
                </div>

                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                    {guide.title}
                </h1>

                <p style={{ fontSize: '1.25rem', color: '#a1a1aa', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>
                    {guide.excerpt}
                </p>
            </div>

            {/* Cover Image */}
            {guide.cover_image && (
                <div style={{ position: 'relative', width: '100%', height: '450px', borderRadius: '1rem', overflow: 'hidden', marginBottom: '3rem', border: '1px solid #27272a' }}>
                    <Image src={guide.cover_image} alt={guide.title} fill style={{ objectFit: 'cover' }} />
                </div>
            )}

            {/* Content Body */}
            <div style={{ color: '#d4d4d8', lineHeight: 1.8, fontSize: '1.125rem' }}>
                {guide.content ? (
                    <div style={{ whiteSpace: 'pre-wrap' }}>{guide.content}</div>
                ) : (
                    <div style={{ backgroundColor: '#18181b', padding: '2rem', borderRadius: '0.75rem', textAlign: 'center', border: '1px dashed #3f3f46' }}>
                        <p style={{ color: '#71717a', fontStyle: 'italic' }}>Bu rehberin detay içeriği henüz hazırlanmamıştır, yakında eklenecektir.</p>
                    </div>
                )}

                <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #27272a', color: '#71717a', fontSize: '0.875rem', textAlign: 'center' }}>
                    ExploreKadikoy Editörleri tarafından {new Date(guide.created_at).toLocaleDateString('tr-TR')} tarihinde oluşturuldu.
                </div>
            </div>
        </main>
    );
}
