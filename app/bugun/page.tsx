import EventCard from '../../components/EventCard';
import styles from '../etkinlikler/page.module.css';

export const metadata = {
    title: 'Bugün Kadıköy\'de Neler Var? - ExploreKadikoy',
    description: 'Kadıköy\'de bugün gerçekleşecek konser, tiyatro, atölye ve sergi etkinlikleri.',
};

import { supabase } from '../../utils/supabase';

export const revalidate = 60; // Refresh cache every 60 seconds
import { format, addDays } from 'date-fns';

export default async function BugunPage() {
    const today = format(new Date(), 'yyyy-MM-dd');
    const twoWeeksLater = format(addDays(new Date(), 14), 'yyyy-MM-dd');
    const { data: rawEvents } = await supabase.from('events').select(`
        id, title, slug, date, time, is_free, cover_image, description, event_type, event_subtype,
        venues:venue_id (name)
    `).gte('date', today).lte('date', twoWeeksLater).order('date', { ascending: true }).order('time', { ascending: true });

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
                    <h1 className={styles.title}>Yaklaşan Etkinlikler</h1>
                    <p className={styles.subtitle}>Bugünden itibaren önümüzdeki 2 hafta boyunca Kadıköy'de gerçekleşecek etkinlikleri keşfedin.</p>
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
