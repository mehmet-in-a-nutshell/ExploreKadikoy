import { supabase } from '../../../utils/supabase';
import { createClient } from '../../../utils/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

export const revalidate = 60;

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Check if user is admin
    const supabaseServer = await createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();
    const isAdmin = user?.email === 'admin@explorekadikoy.com';

    const { data: event } = await supabase
        .from('events')
        .select(`
            *,
            venues:venue_id (name, slug, neighborhood, google_maps_url)
        `)
        .eq('slug', slug)
        .single();

    if (!event) {
        notFound();
    }

    // Check if this is a recurring event by searching for future events with the exact same title
    const { data: futureOccurrences } = await supabase
        .from('events')
        .select('id')
        .eq('title', event.title)
        .gt('date', event.date)
        .limit(1);

    const isRecurring = futureOccurrences && futureOccurrences.length > 0;

    // Determine the day of the week
    let dayOfWeek = "";
    if (isRecurring && event.date) {
        try {
            dayOfWeek = format(parseISO(event.date), 'EEEE', { locale: tr });
        } catch (e) {
            console.error("Error formatting date:", e);
        }
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
                    <img src={event.cover_image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            ) : (
                <div style={{ width: '100%', height: '200px', backgroundColor: '#27272a', borderRadius: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#71717a' }}>Görsel Yok</span>
                </div>
            )}

            {/* Header Info */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {event.event_type && (
                        <span style={{ backgroundColor: '#6366f1', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500 }}>
                            {event.event_type} {event.event_subtype && `• ${event.event_subtype}`}
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
                    {isRecurring && dayOfWeek && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(99, 102, 241, 0.15)', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818cf8', fontWeight: 500 }}>
                            <span>🔁</span> <span>Her hafta <strong>{dayOfWeek}</strong> günü</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📅</span> <strong>Tarih:</strong> {format(parseISO(event.date), 'dd MMMM yyyy', { locale: tr })} {event.time && `- ${event.time}`}
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
            <div className="markdown-content" style={{ color: '#d4d4d8', lineHeight: 1.7, fontSize: '1.125rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1rem', fontWeight: 600 }}>Etkinlik Hakkında</h3>
                {event.description ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{event.description}</ReactMarkdown>
                ) : (
                    <p style={{ color: '#71717a', fontStyle: 'italic' }}>Bu etkinlik için henüz detaylı bir açıklama girilmemiş.</p>
                )}
            </div>

            {/* Google Maps Embed Section (from Venue) */}
            {event.venues?.google_maps_url && event.venues.google_maps_url.includes('<iframe') && (
                <div style={{ marginTop: '4rem' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1.5rem', fontWeight: 600 }}>Lokasyon</h3>
                    <div style={{ borderRadius: '1rem', overflow: 'hidden', border: '1px solid #27272a' }}>
                        <div
                            style={{ width: '100%', height: '350px' }}
                            dangerouslySetInnerHTML={{ __html: event.venues.google_maps_url.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"') }}
                        />
                    </div>
                </div>
            )}

            {/* Admin Edit Button */}
            {isAdmin && (
                <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #27272a', textAlign: 'center' }}>
                    <Link
                        href={`/admin/events/edit/${event.id}`}
                        style={{ display: 'inline-block', backgroundColor: '#6366f1', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600 }}
                    >
                        Bu Etkinliği Düzenle (Admin)
                    </Link>
                </div>
            )}
        </main>
    );
}
