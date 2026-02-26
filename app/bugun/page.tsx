import EventCard from '../../components/EventCard';
import styles from '../etkinlikler/page.module.css';

export const metadata = {
    title: 'Bugün Kadıköy\'de Neler Var? - ExploreKadikoy',
    description: 'Kadıköy\'de bugün gerçekleşecek konser, tiyatro, atölye ve sergi etkinlikleri.',
};

import { supabase } from '../../utils/supabase';

export const revalidate = 60; // Refresh cache every 60 seconds
import { format, addDays, subMonths } from 'date-fns';
import { EVENT_TAXONOMY } from '../../utils/taxonomies';
import { filterDistinctEvents } from '../../utils/eventFilter';
import Link from 'next/link';

export default async function BugunPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; filter?: string; sort?: string }>
}) {
    const params = await searchParams;
    const today = format(new Date(), 'yyyy-MM-dd');
    const twoWeeksLater = format(addDays(new Date(), 14), 'yyyy-MM-dd');
    const oneMonthAgo = format(subMonths(new Date(), 1), 'yyyy-MM-dd');

    // Fetch upcoming and past events in parallel
    const [upcomingResult, pastResult] = await Promise.all([
        supabase.from('events').select(`
            id, title, slug, date, time, is_free, cover_image, description, event_type, event_subtype,
            venues:venue_id (name)
        `).gte('date', today).lte('date', twoWeeksLater).order('date', { ascending: true }).order('time', { ascending: true }),

        supabase.from('events').select(`
            id, title, slug, date, time, is_free, cover_image, description, event_type, event_subtype,
            venues:venue_id (name)
        `).gte('date', oneMonthAgo).lt('date', today).order('date', { ascending: false }).order('time', { ascending: false })
    ]);

    const rawEvents = upcomingResult.data;
    const rawPastEvents = pastResult.data;

    const distinctUpcoming = filterDistinctEvents(rawEvents || []);
    const distinctPast = filterDistinctEvents(rawPastEvents || []);

    const events = distinctUpcoming.map((e: any) => ({
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

    const pastEvents = distinctPast.map((e: any) => ({
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

    // Read current searchParams
    const currentCategory = params.category || 'Tümü';
    const currentFilter = params.filter || 'Tümü';

    let eventsToDisplay = [...events];
    let pastEventsToDisplay = [...pastEvents];

    if (currentCategory !== 'Tümü') {
        eventsToDisplay = eventsToDisplay.filter(e =>
            e.eventType?.toLowerCase() === currentCategory.toLowerCase() ||
            e.eventSubtype?.toLowerCase() === currentCategory.toLowerCase()
        );
        pastEventsToDisplay = pastEventsToDisplay.filter(e =>
            e.eventType?.toLowerCase() === currentCategory.toLowerCase() ||
            e.eventSubtype?.toLowerCase() === currentCategory.toLowerCase()
        );
    }

    if (currentFilter === 'Ücretsiz') {
        eventsToDisplay = eventsToDisplay.filter(e => e.isFree);
        pastEventsToDisplay = pastEventsToDisplay.filter(e => e.isFree);
    }

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Yaklaşan Etkinlikler</h1>
                    <p className={styles.subtitle}>Bugünden itibaren önümüzdeki 2 hafta boyunca Kadıköy'de gerçekleşecek etkinlikleri keşfedin.</p>
                </div>

                <div className={styles.filtersWrapper}>
                    <div className={styles.filtersScroll}>
                        <Link href="/bugun" className={`${styles.filterBtn} ${currentCategory === 'Tümü' && currentFilter === 'Tümü' ? styles.active : ''}`}>
                            Tümü
                        </Link>
                        <Link href="/bugun?filter=Ücretsiz" className={`${styles.filterBtn} ${currentFilter === 'Ücretsiz' ? styles.active : ''}`}>
                            Ücretsiz
                        </Link>
                        <div className={styles.divider}></div>
                        {Object.keys(EVENT_TAXONOMY).map(cat => (
                            <Link
                                key={cat}
                                href={`/bugun?category=${encodeURIComponent(cat)}`}
                                className={`${styles.filterBtn} ${currentCategory === cat ? styles.active : ''}`}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>
            </header>

            <section className={styles.results}>
                <div className={styles.resultsInfo}>
                    <p><span>{eventsToDisplay.length} etkinlik</span> bulundu</p>
                </div>

                <div className={styles.grid}>
                    {eventsToDisplay.map((evt) => (
                        <EventCard key={evt.id} {...evt} />
                    ))}

                    {eventsToDisplay.length === 0 && (
                        <div style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-secondary)' }}>
                            <p>Bu filtreye uygun yaklaşan etkinlik bulunamadı.</p>
                            <Link href="/bugun" style={{ color: 'var(--accent-primary)', marginTop: '1rem', display: 'inline-block' }}>Filtreleri Temizle</Link>
                        </div>
                    )}
                </div>
            </section>

            {pastEventsToDisplay.length > 0 && (
                <section className={styles.results} style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
                    <div className={styles.headerContent}>
                        <h2 className={styles.title} style={{ fontSize: '2rem' }}>Tamamlanan Etkinlikler</h2>
                        <p className={styles.subtitle}>Son 1 ay içinde Kadıköy'de gerçekleşen etkinlikler.</p>
                    </div>

                    <div className={styles.resultsInfo} style={{ marginTop: '1.5rem' }}>
                        <p><span>{pastEventsToDisplay.length} etkinlik</span> bulundu</p>
                    </div>

                    <div className={styles.grid}>
                        {pastEventsToDisplay.map((evt) => (
                            <EventCard key={evt.id} {...evt} />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
