import { createClient } from '../../utils/supabase/server';
import { redirect } from 'next/navigation';
import EventCard from '../../components/EventCard';
import VenueCard from '../../components/VenueCard';

export const revalidate = 0; // Fresh fetch every time

export default async function ProfilePage() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            redirect('/login');
        }

        // Fetch favorite events with nested event details
        const { data: rawFavEvents } = await supabase
            .from('user_favorite_events')
            .select(`
            event_id,
            events (
                id, title, slug, date, time, is_free, cover_image,
                venues:venue_id (name),
                categories:category_id (name)
            )
        `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        // Safely extract and array-check the events
        const favEvents = (rawFavEvents || [])
            .map((f: any) => f.events)
            .map((e: any) => Array.isArray(e) ? e[0] : e)
            .filter(Boolean)
            .map((e: any) => {
                const venues = Array.isArray(e.venues) ? e.venues[0] : e.venues;
                const categories = Array.isArray(e.categories) ? e.categories[0] : e.categories;

                return {
                    id: e.id,
                    title: e.title,
                    slug: e.slug,
                    date: e.date,
                    time: e.time,
                    isFree: e.is_free,
                    imageUrl: e.cover_image,
                    venue: venues?.name || 'Kadıköy',
                    category: categories?.name || 'Diğer'
                };
            });

        // Fetch favorite venues with nested venue details
        const { data: rawFavVenues } = await supabase
            .from('user_favorite_venues')
            .select(`
            venue_id,
            venues (
                id, name, slug, neighborhood, description, cover_image, rating
            )
        `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        // Safely extract and array-check the venues
        const favVenues = (rawFavVenues || [])
            .map((f: any) => f.venues)
            .map((v: any) => Array.isArray(v) ? v[0] : v)
            .filter(Boolean)
            .map((v: any) => ({
                id: v.id,
                name: v.name,
                neighborhood: v.neighborhood || 'Kadıköy',
                description: v.description || '',
                slug: v.slug,
                imageUrl: v.cover_image,
                rating: v.rating
            }));

        return (
            <main style={{ minHeight: '100vh', padding: '6rem 2rem 5rem 2rem' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                    {/* Profile Header */}
                    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '2.5rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'white' }}>Profilim</h1>
                            <p style={{ color: 'var(--text-secondary)' }}>Hoş geldiniz, {user.email || 'Kullanıcı'}</p>
                        </div>

                        <form action="/auth/logout" method="post">
                            <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s' }}>
                                Çıkış Yap
                            </button>
                        </form>
                    </div>

                    {/* Favorites Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>

                        {/* Favorite Events */}
                        <section>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #27272a' }}>
                                Favori Etkinliklerim ({favEvents.length})
                            </h2>

                            {favEvents.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                                    {favEvents.map((evt) => (
                                        <EventCard key={evt.id} {...evt} />
                                    ))}
                                </div>
                            ) : (
                                <div style={{ backgroundColor: '#18181b', padding: '3rem', borderRadius: '1rem', textAlign: 'center', border: '1px dashed #3f3f46' }}>
                                    <p style={{ color: '#a1a1aa', marginBottom: '1rem' }}>Henüz favorilerinize etkinlik eklemediniz.</p>
                                    <a href="/etkinlikler" style={{ color: '#ec4899', fontWeight: 600, textDecoration: 'none' }}>Etkinlikleri Keşfet &rarr;</a>
                                </div>
                            )}
                        </section>

                        {/* Favorite Venues */}
                        <section>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #27272a' }}>
                                Favori Mekanlarım ({favVenues.length})
                            </h2>

                            {favVenues.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                                    {favVenues.map((venue) => (
                                        <VenueCard key={venue.id} {...venue} />
                                    ))}
                                </div>
                            ) : (
                                <div style={{ backgroundColor: '#18181b', padding: '3rem', borderRadius: '1rem', textAlign: 'center', border: '1px dashed #3f3f46' }}>
                                    <p style={{ color: '#a1a1aa', marginBottom: '1rem' }}>Henüz favorilerinize mekan eklemediniz.</p>
                                    <a href="/mekanlar" style={{ color: '#ec4899', fontWeight: 600, textDecoration: 'none' }}>Mekanları Keşfet &rarr;</a>
                                </div>
                            )}
                        </section>
                    </div>

                </div>
            </main>
        );

    } catch (error: any) {
        if (error.message === 'NEXT_REDIRECT') {
            throw error; // Let Next.js handle redirects!
        }
        return (
            <main style={{ minHeight: '100vh', padding: '6rem 2rem 5rem 2rem', color: 'white' }}>
                <h1>Sayfa Yüklenirken Hata Oluştu</h1>
                <pre style={{ whiteSpace: 'pre-wrap', color: '#f87171' }}>{error.message}</pre>
                <pre style={{ whiteSpace: 'pre-wrap', color: '#a1a1aa' }}>{error.stack}</pre>
            </main>
        );
    }
}
