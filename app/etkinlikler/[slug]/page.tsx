import { supabase } from '../../../utils/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 60;

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = params;

    const { data: event } = await supabase
        .from('events')
        .select(`
            *,
            venues:venue_id (name, slug, neighborhood),
            categories:category_id (name, slug)
        `)
        .eq('slug', slug)
        .single();

    if (!event) {
        notFound();
    }

    return (
        <main style={{ minHeight: '100vh', padding: '6rem 2rem 2rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
            {/* Back Button */}
            <Link href="/etkinlikler" style={{ display: 'inline-block', marginBottom: '2rem', color: '#a1a1aa', textDecoration: 'none', transition: 'color 0.2s' }}>
                &larr; Etkinliklere Dön
            </Link>

            {/* Cover Image */}
            {event.cover_image ? (
                <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '1rem', overflow: 'hidden', marginBottom: '2rem' }}>
                    <Image src={event.cover_image} alt={event.title} fill style={{ objectFit: 'cover' }} />
                </div>
            ) : (
                <div style={{ width: '100%', height: '200px', backgroundColor: '#27272a', borderRadius: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#71717a' }}>Görsel Yok</span>
                </div>
            )}

            {/* Header Info */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {event.categories && (
                        <span style={{ backgroundColor: '#6366f1', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500 }}>
                            {event.categories.name}
                        </span>
                    )}
                    {event.is_free && (
                        <span style={{ backgroundColor: '#10b981', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500 }}>
                            Ücretsiz
                        </span>
                    )}
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem', lineHeight: 1.2 }}>{event.title}</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#e4e4e7', backgroundColor: '#18181b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #27272a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📅</span> <strong>Tarih:</strong> {event.date} {event.time && `- ${event.time}`}
                    </div>
                    {event.venues && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>📍</span> <strong>Mekan:</strong>
                            <Link href={`/mekan/${event.venues.slug}`} style={{ color: '#6366f1', textDecoration: 'none' }}>
                                {event.venues.name}
                            </Link>
                            {event.venues.neighborhood && <span style={{ color: '#a1a1aa' }}>({event.venues.neighborhood})</span>}
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div style={{ color: '#d4d4d8', lineHeight: 1.7, fontSize: '1.125rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1rem', fontWeight: 600 }}>Etkinlik Hakkında</h3>
                {event.description ? (
                    <div style={{ whiteSpace: 'pre-wrap' }}>{event.description}</div>
                ) : (
                    <p style={{ color: '#71717a', fontStyle: 'italic' }}>Bu etkinlik için henüz detaylı bir açıklama girilmemiş.</p>
                )}
            </div>
        </main>
    );
}
