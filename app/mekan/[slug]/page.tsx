import { supabase } from '../../../utils/supabase';
import { createClient } from '../../../utils/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import EventCard from '../../../components/EventCard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const revalidate = 60;

export default async function VenueDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Check if user is admin
    const supabaseServer = await createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();
    const isAdmin = user?.email === 'admin@explorekadikoy.com';

    // Fetch venue details
    const { data: venue } = await supabase
        .from('venues')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!venue) {
        notFound();
    }

    // Fetch events happening at this venue
    const { data: rawEvents } = await supabase
        .from('events')
        .select(`
            id, title, slug, date, time, is_free, cover_image, description, event_type, event_subtype
        `)
        .eq('venue_id', venue.id)
        .order('created_at', { ascending: false });

    const venueEvents = (rawEvents || []).map((e: any) => ({
        id: e.id,
        title: e.title,
        slug: e.slug,
        date: e.date,
        time: e.time,
        isFree: e.is_free,
        isRecurring: e.isRecurring,
        imageUrl: e.cover_image,
        venue: venue.name, // We know the venue name
        eventType: e.event_type || 'Diğer',
        eventSubtype: e.event_subtype || ''
    }));

    return (
        <main style={{ minHeight: '100vh', padding: '6rem 2rem 2rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <Link href="/mekanlar" style={{ display: 'inline-block', marginBottom: '2rem', color: '#a1a1aa', textDecoration: 'none', transition: 'color 0.2s' }}>
                &larr; Tüm Mekanlara Dön
            </Link>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '4rem' }}>
                {/* Image Section */}
                <div style={{ flex: 1 }}>
                    {venue.cover_image ? (
                        <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '1rem', overflow: 'hidden' }}>
                            <img src={venue.cover_image} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    ) : (
                        <div style={{ width: '100%', height: '400px', backgroundColor: '#27272a', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: '#71717a' }}>Mekan Görseli Yok</span>
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <span style={{ backgroundColor: '#27272a', color: '#e4e4e7', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem' }}>
                            Mekan
                        </span>
                        {venue.venue_type && (
                            <span style={{ color: '#c084fc', fontSize: '1rem', fontWeight: 500 }}>{venue.venue_type}</span>
                        )}
                        {venue.neighborhood && (
                            <span style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>📍 {venue.neighborhood}</span>
                        )}
                    </div>

                    <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                        {venue.name}
                    </h1>

                    <div className="markdown-content" style={{ color: '#d4d4d8', lineHeight: 1.7, fontSize: '1.125rem' }}>
                        {venue.description ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{venue.description}</ReactMarkdown>
                        ) : (
                            <p style={{ color: '#71717a', fontStyle: 'italic' }}>Bu mekan için henüz bir açıklama eklenmemiş.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Venue Rating Section */}
            {venue.rating && (
                <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#18181b', borderRadius: '1rem', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Mekan Değerlendirmesi</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontSize: '2rem', fontWeight: 'bold' }}>
                        {'⭐'.repeat(Math.round(venue.rating))} <span style={{ color: '#a1a1aa', fontSize: '1.25rem', marginLeft: '0.5rem' }}>{venue.rating} / 5.0</span>
                    </div>
                </div>
            )}

            {/* Google Maps Embed Section */}
            {venue.google_maps_url && venue.google_maps_url.includes('<iframe') && (
                <div style={{ marginTop: '3rem', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #27272a' }}>
                    <div
                        style={{ width: '100%', height: '400px' }}
                        dangerouslySetInnerHTML={{ __html: venue.google_maps_url.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"') }}
                    />
                </div>
            )}

            {/* Related Events Section */}
            <section style={{ borderTop: '1px solid #27272a', paddingTop: '4rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '2rem' }}>
                    Buradaki Etkinlikler
                </h2>

                {venueEvents.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {venueEvents.map((event: any) => (
                            <EventCard key={event.id} {...event} />
                        ))}
                    </div>
                ) : (
                    <div style={{ backgroundColor: '#18181b', padding: '3rem', borderRadius: '1rem', textAlign: 'center', border: '1px dashed #3f3f46' }}>
                        <p style={{ color: '#a1a1aa', fontSize: '1.125rem' }}>Şu an için {venue.name} mekanında planlanmış bir etkinlik bulunmuyor.</p>
                    </div>
                )}
            </section>

            {/* Admin Edit Button */}
            {isAdmin && (
                <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #27272a', textAlign: 'center' }}>
                    <Link
                        href={`/admin/venues/edit/${venue.id}`}
                        style={{ display: 'inline-block', backgroundColor: '#6366f1', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600 }}
                    >
                        Bu Mekanı Düzenle (Admin)
                    </Link>
                </div>
            )}
        </main>
    );
}
