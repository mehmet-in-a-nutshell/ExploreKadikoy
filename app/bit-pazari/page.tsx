import EventCard from '../../components/EventCard';
import styles from '../etkinlikler/page.module.css';

export const metadata = {
    title: 'Kadıköy Bit Pazarı Etkinlikleri - ExploreKadikoy',
    description: 'Kadıköy\'deki vintage, ikinci el ve tasarım pazarlarını keşfedin.',
};

import { supabase } from '../../utils/supabase';

export const revalidate = 60;

export default async function BitPazariPage() {
    const { data: rawEvents } = await supabase.from('events').select(`
        id, title, slug, date, time, is_free, cover_image, description, event_type, event_subtype,
        venues:venue_id (name)
    `).order('created_at', { ascending: false });

    const events = (rawEvents || [])
        .filter((e: any) => e.event_subtype === 'Bit pazarı')
        .map((e: any) => ({
            id: e.id,
            title: e.title,
            slug: e.slug,
            date: e.date,
            time: e.time,
            isFree: e.is_free,
            imageUrl: e.cover_image,
            venue: e.venues?.name || 'Kadıköy',
            eventType: e.event_type || '🛍️ Pazar & Deneyim',
            eventSubtype: e.event_subtype || ''
        }));

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Bit Pazarı & İkinci El</h1>
                    <p className={styles.subtitle}>Vintage hazineler ve sürdürülebilir alışveriş deneyimi.</p>
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
