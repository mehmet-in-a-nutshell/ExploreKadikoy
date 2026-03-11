import EventCard from '../../components/EventCard';
import styles from '../etkinlikler/page.module.css';

export const metadata = {
    title: 'Ücretsiz Etkinlikler - ExploreKadikoy',
    description: 'Kadıköy\'de katılabileceğiniz ücretsiz konser, atölye ve sergi etkinlikleri.',
};

import { supabase } from '../../utils/supabase';
import { filterDistinctEvents } from '../../utils/eventFilter';
import { format, subMonths, addDays } from 'date-fns';

export const revalidate = 60; // Refresh cache every 60 seconds

export default async function UcretsizPage() {
    const today = format(new Date(), 'yyyy-MM-dd');
    const oneMonthAgo = format(subMonths(new Date(), 1), 'yyyy-MM-dd');
    const twoWeeksLater = format(addDays(new Date(), 14), 'yyyy-MM-dd');

    const { data: rawEvents } = await supabase.from('events').select(`
        id, title, slug, date, time, is_free, cover_image, description, event_type, event_subtype,
        venues:venue_id (name)
    `).eq('is_free', true).gte('date', oneMonthAgo).order('date', { ascending: true }).order('time', { ascending: true });

    const allCategoryEvents = (rawEvents || []).map((e: any) => ({
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


    const events = filterDistinctEvents(allCategoryEvents.filter((e: any) => e.date >= today && e.date <= twoWeeksLater));
    const pastEvents = filterDistinctEvents(allCategoryEvents.filter((e: any) => e.date < today)).sort((a: any, b: any) => b.date.localeCompare(a.date));

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
                    <p>Önümüzdeki iki hafta içinde <span>{events.length} ücretsiz etkinlik</span> bulundu</p>
                </div>

                <div className={styles.grid}>
                    {events.map((evt: any) => (
                        <EventCard key={evt.id} {...evt} />
                    ))}
                </div>
            </section>

            {pastEvents.length > 0 && (
                <section className={styles.results} style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
                    <div className={styles.headerContent}>
                        <h2 className={styles.title} style={{ fontSize: '2rem' }}>Tamamlanan Etkinlikler</h2>
                        <p className={styles.subtitle}>Son 1 ay içinde gerçekleşen etkinlikler.</p>
                    </div>

                    <div className={styles.resultsInfo} style={{ marginTop: '1.5rem' }}>
                        <p><span>{pastEvents.length} ücretsiz etkinlik</span> bulundu</p>
                    </div>

                    <div className={styles.grid}>
                        {pastEvents.map((evt: any) => (
                            <EventCard key={evt.id} {...evt} />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
