import EventCard from '../../components/EventCard';
import styles from '../etkinlikler/page.module.css';

export const metadata = {
    title: 'Kadıköy Workshop ve Atölyeler - ExploreKadikoy',
    description: 'Kadıköy\'deki yaratıcı atölyeler, eğitimler ve workshop etkinliklerini keşfedin.',
};

import { supabase } from '../../utils/supabase';

export const revalidate = 60;

export default async function WorkshopPage() {
    const { data: rawEvents } = await supabase.from('events').select(`
        id, title, slug, date, time, is_free, cover_image, description, event_type, event_subtype,
        venues:venue_id (name)
    `).order('created_at', { ascending: false });

    const events = (rawEvents || [])
        .filter((e: any) => e.event_subtype === 'Workshop' || e.event_subtype === 'Atölye')
        .map((e: any) => ({
            id: e.id,
            title: e.title,
            slug: e.slug,
            date: e.date,
            time: e.time,
            isFree: e.is_free,
            imageUrl: e.cover_image,
            venue: e.venues?.name || 'Kadıköy',
            eventType: e.event_type || '🎓 Öğrenme & Atölye',
            eventSubtype: e.event_subtype || ''
        }));

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Atölye & Workshop</h1>
                    <p className={styles.subtitle}>Yeni beceriler edinin, yaratıcılığınızı keşfedin.</p>
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
