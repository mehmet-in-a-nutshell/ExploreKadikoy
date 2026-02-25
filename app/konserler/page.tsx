import EventCard from '../../components/EventCard';
import styles from '../etkinlikler/page.module.css';

export const metadata = {
    title: 'Kadıköy Konserleri - ExploreKadikoy',
    description: 'Kadıköy\'deki güncel konserleri, canlı müzik mekanlarını ve alternatif sahneleri keşfedin.',
};

import { supabase } from '../../utils/supabase';

export const revalidate = 60; // Refresh cache every 60 seconds

export default async function KonserlerPage() {
    const { data: rawEvents } = await supabase.from('events').select(`
        id, title, slug, date, time, is_free, cover_image, description, event_type, event_subtype,
        venues:venue_id (name)
    `).order('created_at', { ascending: false });

    // Filter out nulls because Supabase .eq on joined tables acts as an INNER JOIN for that row only
    // or we can filter in JS. PostgREST filtering on foreign tables might return the event with categories: null.
    // It's safer to just filter in JS for now or use the foreign table filter.
    const events = (rawEvents || [])
        .filter((e: any) => e.event_type === '🎶 Müzik')
        .map((e: any) => ({
            id: e.id,
            title: e.title,
            slug: e.slug,
            date: e.date,
            time: e.time,
            isFree: e.is_free,
            imageUrl: e.cover_image,
            venue: e.venues?.name || 'Kadıköy',
            eventType: e.event_type || '🎶 Müzik',
            eventSubtype: e.event_subtype || ''
        }));

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Konserler</h1>
                    <p className={styles.subtitle}>En iyi sesler, en iyi mekanlar Kadıköy sahnesinde buluşuyor.</p>
                </div>
            </header>

            <section className={styles.results}>
                <div className={styles.resultsInfo}>
                    <p><span>{events.length} konser</span> bulundu</p>
                </div>

                <div className={styles.grid}>
                    {events.map((evt) => (
                        <EventCard key={evt.id} {...evt} />
                    ))}
                </div>
            </section>
        </main>
    );
}
