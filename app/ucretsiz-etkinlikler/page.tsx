import EventCard from '../../components/EventCard';
import styles from '../etkinlikler/page.module.css';

export const metadata = {
    title: 'Ücretsiz Etkinlikler - ExploreKadikoy',
    description: 'Kadıköy\'de katılabileceğiniz ücretsiz konser, atölye ve sergi etkinlikleri.',
};

import { supabase } from '../../utils/supabase';
import { filterDistinctEvents } from '../../utils/eventFilter';

export const revalidate = 60; // Refresh cache every 60 seconds

export default async function UcretsizPage() {
    const { data: rawEvents } = await supabase.from('events').select(`
        id, title, slug, date, time, is_free, cover_image, description, event_type, event_subtype,
        venues:venue_id (name)
    `).eq('is_free', true).order('created_at', { ascending: false });

    const events = (rawEvents || []).map((e: any) => ({
        id: e.id,
        title: e.title,
        slug: e.slug,
        date: e.date,
        time: e.time,
        isFree: e.is_free,
        imageUrl: e.cover_image,
        venue: e.venues?.name || 'Kadıköy',
        eventType: e.event_type || 'Diğer',
        eventSubtype: e.event_subtype || ''
    }));

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Ücretsiz Etkinlikler</h1>
                    <p className={styles.subtitle}>Cüzdanınızı yormadan Kadıköy'ün keyfini çıkarın.</p>
                </div>
            </header>

            <section className={styles.results}>
                <div className={styles.resultsInfo}>
                    <p><span>{events.length} ücretsiz etkinlik</span> bulundu</p>
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
