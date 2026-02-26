import EventCard from '../../components/EventCard';
import styles from '../etkinlikler/page.module.css';

export const metadata = {
    title: 'Kadıköy Tadım Etkinlikleri - ExploreKadikoy',
    description: 'Kadıköy\'deki lezzet dolu gastronomi ve tadım etkinliklerini keşfedin.',
};

import { supabase } from '../../utils/supabase';
import { filterDistinctEvents } from '../../utils/eventFilter';

export const revalidate = 60;

export default async function TadimPage() {
    const { data: rawEvents } = await supabase.from('events').select(`
        id, title, slug, date, time, is_free, cover_image, description, event_type, event_subtype,
        venues:venue_id (name)
    `).order('date', { ascending: true });

    const distinctEvents = filterDistinctEvents(rawEvents || []);

    const events = distinctEvents
        .filter((e: any) => e.event_subtype === 'Tadım etkinliği')
        .map((e: any) => ({
            id: e.id,
            title: e.title,
            slug: e.slug,
            date: e.date,
            time: e.time,
            isFree: e.is_free,
            imageUrl: e.cover_image,
            venue: e.venues?.name || 'Kadıköy',
            eventType: e.event_type || '🍽️ Gastronomi',
            eventSubtype: e.event_subtype || ''
        }));

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Tadım Etkinlikleri</h1>
                    <p className={styles.subtitle}>Gastronomi dünyasında yeni lezzetler keşfedin.</p>
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
