import EventCard from '../../components/EventCard';
import styles from './page.module.css';
import Link from 'next/link';

import { supabase } from '../../utils/supabase';

export const metadata = {
    title: 'Tüm Etkinlikler - ExploreKadikoy',
    description: 'Kadıköy\'deki tüm etkinlikleri keşfedin. Konserler, tiyatrolar, sergiler ve atölyeler.',
};

import { format, subMonths } from 'date-fns';
import { filterDistinctEvents } from '../../utils/eventFilter';
export const revalidate = 60; // Refresh cache every 60 seconds
import { EVENT_TAXONOMY } from '../../utils/taxonomies';

export default async function EtkinliklerPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; filter?: string; sort?: string }>
}) {
    const params = await searchParams;
    const today = format(new Date(), 'yyyy-MM-dd');
    const oneMonthAgo = format(subMonths(new Date(), 1), 'yyyy-MM-dd');

    const [upcomingResult, pastResult] = await Promise.all([
        supabase.from('events').select(`
            id, title, slug, date, time, is_free, cover_image, description, event_type, event_subtype,
            venues:venue_id (name)
        `).gte('date', today).order('date', { ascending: true }),

        supabase.from('events').select(`
            id, title, slug, date, time, is_free, cover_image, description, event_type, event_subtype,
            venues:venue_id (name)
        `).gte('date', oneMonthAgo).lt('date', today).order('date', { ascending: false })
    ]);

    const distinctEvents = filterDistinctEvents(upcomingResult.data || []);
    const distinctPastEvents = filterDistinctEvents(pastResult.data || []);

    const allEvents = distinctEvents.map((e: any) => ({
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

    const allPastEvents = distinctPastEvents.map((e: any) => ({
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
    const currentSort = params.sort || 'Yaklaşanlar';

    // Apply filtering
    let events = [...allEvents];
    let pastEvents = [...allPastEvents];

    if (currentCategory !== 'Tümü') {
        events = events.filter(e =>
            e.eventType?.toLowerCase() === currentCategory.toLowerCase() ||
            e.eventSubtype?.toLowerCase() === currentCategory.toLowerCase()
        );
        pastEvents = pastEvents.filter(e =>
            e.eventType?.toLowerCase() === currentCategory.toLowerCase() ||
            e.eventSubtype?.toLowerCase() === currentCategory.toLowerCase()
        );
    }

    if (currentFilter === 'Bugün') {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        events = events.filter(e => e.date === todayStr || e.date?.toLowerCase().includes('bugün'));
        pastEvents = []; // Can't be past and today simultaneously
    } else if (currentFilter === 'Ücretsiz') {
        events = events.filter(e => e.isFree);
        pastEvents = pastEvents.filter(e => e.isFree);
    }

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Tüm Etkinlikler</h1>
                    <p className={styles.subtitle}>Kadıköy'de keşfedilecek düzinelerce etkinlik seni bekliyor.</p>
                </div>

                <div className={styles.filtersWrapper}>
                    <div className={styles.filtersScroll}>
                        <Link href="/etkinlikler" className={`${styles.filterBtn} ${currentCategory === 'Tümü' && currentFilter === 'Tümü' ? styles.active : ''}`}>
                            Tümü
                        </Link>
                        <Link href="/etkinlikler?filter=Bugün" className={`${styles.filterBtn} ${currentFilter === 'Bugün' ? styles.active : ''}`}>
                            Bugün
                        </Link>
                        <Link href="/etkinlikler?filter=Ücretsiz" className={`${styles.filterBtn} ${currentFilter === 'Ücretsiz' ? styles.active : ''}`}>
                            Ücretsiz
                        </Link>
                        <div className={styles.divider}></div>
                        {Object.keys(EVENT_TAXONOMY).map(cat => (
                            <Link
                                key={cat}
                                href={`/etkinlikler?category=${encodeURIComponent(cat)}`}
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
                    <p><span>{events.length} etkinlik</span> bulundu</p>
                    <div className={styles.sort}>
                        <select className={styles.select} defaultValue={currentSort}>
                            <option value="Yaklaşanlar">Yaklaşanlar</option>
                            <option value="Ücretsizler Önce">Ücretsizler Önce</option>
                            <option value="A-Z">A-Z</option>
                        </select>
                    </div>
                </div>

                <div className={styles.grid}>
                    {events.map((evt) => (
                        <EventCard key={evt.id} {...evt} />
                    ))}

                    {events.length === 0 && (
                        <div style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-secondary)' }}>
                            <p>Bu filtreye uygun etkinlik bulunamadı.</p>
                            <Link href="/etkinlikler" style={{ color: 'var(--accent-primary)', marginTop: '1rem', display: 'inline-block' }}>Filtreleri Temizle</Link>
                        </div>
                    )}
                </div>
            </section>

            {pastEvents.length > 0 && (
                <section className={styles.results} style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
                    <div className={styles.headerContent}>
                        <h2 className={styles.title} style={{ fontSize: '2rem' }}>Tamamlanan Etkinlikler</h2>
                        <p className={styles.subtitle}>Son 1 ay içinde gerçekleşen etkinlikler.</p>
                    </div>

                    <div className={styles.resultsInfo} style={{ marginTop: '1.5rem' }}>
                        <p><span>{pastEvents.length} etkinlik</span> bulundu</p>
                    </div>

                    <div className={styles.grid}>
                        {pastEvents.map((evt) => (
                            <EventCard key={evt.id} {...evt} />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
