import EventCard from '../../components/EventCard';
import styles from '../etkinlikler/page.module.css';

export const metadata = {
    title: 'Kadıköy Dans Etkinlikleri - ExploreKadikoy',
    description: 'Kadıköy\'deki güncel dans atölyeleri, gösterileri ve partilerini keşfedin.',
};

import { supabase } from '../../utils/supabase';
import { filterDistinctEvents } from '../../utils/eventFilter';

export const revalidate = 60; // Refresh cache every 60 seconds

export default async function DansPage() {
    const { data: rawEvents } = await supabase.from('events').select(`
        id, title, slug, date, time, is_free, cover_image, description, event_type, event_subtype,
        venues:venue_id (name)
    `).order('date', { ascending: true });

    const distinctEvents = filterDistinctEvents(rawEvents || []);

    const events = distinctEvents
        .filter((e: any) => e.event_type === '🎬 Kültür & Sanat' && e.event_subtype?.includes('Dans'))
        .map((e: any) => ({
            id: e.id,
            title: e.title,
            slug: e.slug,
            date: e.date,
            time: e.time,
            isFree: e.is_free,
            imageUrl: e.cover_image,
            venue: e.venues?.name || 'Kadıköy',
            eventType: e.event_type || '🎬 Kültür & Sanat',
            eventSubtype: e.event_subtype || ''
        }));

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Dans Etkinlikleri</h1>
                    <p className={styles.subtitle}>En enerjik dans gösterileri, atölyeler ve pratikleri keşfedin.</p>
                </div>
            </header>

            <section className={styles.results}>
                <div className={styles.resultsInfo}>
                    <p><span>{events.length} etkinlik</span> bulundu</p>
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
