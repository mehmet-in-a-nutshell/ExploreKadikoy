import EventCard from '../../components/EventCard';
import VenueCard from '../../components/VenueCard';
import styles from '../etkinlikler/page.module.css'; // Reuse filtering/layout styles
import { supabase } from '../../utils/supabase';

export const metadata = {
    title: 'Arama Sonuçları - ExploreKadikoy',
    description: 'ExploreKadikoy arama sonuçları.',
};

export const revalidate = 10;

export default async function AramaPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const params = await searchParams;
    const query = params.q || '';

    let events: any[] = [];
    let venues: any[] = [];

    if (query) {
        // Search in events (title or description)
        const { data: rawEvents } = await supabase.from('events').select(`
            id, title, slug, date, time, is_free, cover_image, description,
            venues:venue_id (name),
            categories:category_id (name)
        `).or(`title.ilike.%${query}%,description.ilike.%${query}%`).order('date', { ascending: true });

        events = (rawEvents || []).map((e: any) => ({
            id: e.id,
            title: e.title,
            slug: e.slug,
            date: e.date,
            time: e.time,
            isFree: e.is_free,
            imageUrl: e.cover_image,
            venue: e.venues?.name || 'Kadıköy',
            category: e.categories?.name || 'Diğer'
        }));

        // Search in venues (name or description)
        const { data: rawVenues } = await supabase.from('venues').select('*').or(`name.ilike.%${query}%,description.ilike.%${query}%`);
        venues = (rawVenues || []).map((v: any) => ({
            id: v.id,
            name: v.name,
            neighborhood: v.neighborhood || 'Kadıköy',
            description: v.description || '',
            slug: v.slug,
            imageUrl: v.cover_image,
            rating: v.rating
        }));
    }

    const hasResults = events.length > 0 || venues.length > 0;

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Arama Sonuçları</h1>
                    <p className={styles.subtitle}>
                        {query ? `"${query}" için bulunan sonuçlar` : 'Herhangi bir arama terimi girmediniz.'}
                    </p>
                </div>
            </header>

            <section className={styles.results}>
                {!hasResults && query && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <p>Aradığınız kriterlere uygun etkinlik veya mekan bulunamadı.</p>
                    </div>
                )}

                {events.length > 0 && (
                    <div style={{ marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'white' }}>Etkinlikler ({events.length})</h2>
                        <div className={styles.grid}>
                            {events.map((evt) => (
                                <EventCard key={evt.id} {...evt} />
                            ))}
                        </div>
                    </div>
                )}

                {venues.length > 0 && (
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'white' }}>Mekanlar ({venues.length})</h2>
                        <div className={styles.grid}>
                            {venues.map((venue) => (
                                <VenueCard key={venue.id} {...venue} />
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}
