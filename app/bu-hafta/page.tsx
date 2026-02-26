import EventCard from '../../components/EventCard';
import styles from '../etkinlikler/page.module.css';
import { format, addDays } from 'date-fns';

export const metadata = {
    title: 'Bu Hafta Kadıköy\'de Neler Var? - ExploreKadikoy',
    description: 'Kadıköy\'de bu hafta gerçekleşecek tüm etkinlikler.',
};

import { supabase } from '../../utils/supabase';
import { filterDistinctEvents } from '../../utils/eventFilter';

export const revalidate = 60; // Refresh cache every 60 seconds

export default async function BuHaftaPage() {
    const today = format(new Date(), 'yyyy-MM-dd');
    const nextWeek = format(addDays(new Date(), 7), 'yyyy-MM-dd');

    const { data: rawEvents } = await supabase.from('events').select(`
        id, title, slug, date, time, is_free, cover_image, description, event_type, event_subtype,
        venues:venue_id (name)
    `).gte('date', today).lte('date', nextWeek).order('date', { ascending: true }).order('time', { ascending: true });

    const distinctEvents = filterDistinctEvents(rawEvents || []);

    const events = distinctEvents.map((e: any) => ({
        id: e.id,
        title: e.title,
        slug: e.slug,
        date: e.date,
        time: e.time,
        isFree: e.is_free,
        isRecurring: e.isRecurring,
        imageUrl: e.cover_image,
        venue: e.venues?.name || 'Kadıköy',
        eventType: e.event_type || 'Diğer',
        eventSubtype: e.event_subtype || ''
    }));

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Bu Hafta Neler Var?</h1>
                    <p className={styles.subtitle}>Önümüzdeki 7 gün boyunca Kadıköy'de gerçekleşecek harika etkinlikler.</p>
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
