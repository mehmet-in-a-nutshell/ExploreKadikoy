import EventCard from '../../components/EventCard';
import styles from './page.module.css';
import Link from 'next/link';

import { supabase } from '../../utils/supabase';

export const metadata = {
    title: 'Tüm Etkinlikler - ExploreKadikoy',
    description: 'Kadıköy\'deki tüm etkinlikleri keşfedin. Konserler, tiyatrolar, sergiler ve atölyeler.',
};

export const revalidate = 10; // Refresh cache every 10 seconds
import { format } from 'date-fns';
import { EVENT_TAXONOMY } from '../../utils/taxonomies';

export default async function EtkinliklerPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; subtype?: string; filter?: string; sort?: string }>
}) {
    const params = await searchParams;

    const { data: rawEvents } = await supabase.from('events').select(`
        id, title, slug, date, time, is_free, cover_image, description, event_type, event_subtype,
        venues:venue_id (name)
    `).order('created_at', { ascending: false });

    const allEvents = (rawEvents || []).map((e: any) => ({
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

    // Read current searchParams
    const currentCategory = params.category || 'Tümü';
    const currentSubtype = params.subtype || '';
    const currentFilter = params.filter || 'Tümü';
    const currentSort = params.sort || 'Yaklaşanlar';

    // Apply filtering
    let events = [...allEvents];

    if (currentCategory !== 'Tümü') {
        events = events.filter(e =>
            e.eventType?.toLowerCase() === currentCategory.toLowerCase() ||
            e.eventSubtype?.toLowerCase() === currentCategory.toLowerCase()
        );
    }

    if (currentSubtype) {
        events = events.filter(e =>
            e.eventSubtype?.toLowerCase() === currentSubtype.toLowerCase()
        );
    }

    if (currentFilter === 'Bugün') {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        events = events.filter(e => e.date === todayStr || e.date?.toLowerCase().includes('bugün'));
    } else if (currentFilter === 'Ücretsiz') {
        events = events.filter(e => e.isFree);
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

                {currentCategory !== 'Tümü' && EVENT_TAXONOMY[currentCategory] && (
                    <div className={styles.filtersWrapper} style={{ marginTop: '0.75rem' }}>
                        <div className={styles.filtersScroll}>
                            <Link
                                href={`/etkinlikler?category=${encodeURIComponent(currentCategory)}`}
                                className={`${styles.filterBtn} ${!currentSubtype ? styles.active : ''}`}
                                style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}
                            >
                                Tümü
                            </Link>
                            {EVENT_TAXONOMY[currentCategory].map((subtype: string) => (
                                <Link
                                    key={subtype}
                                    href={`/etkinlikler?category=${encodeURIComponent(currentCategory)}&subtype=${encodeURIComponent(subtype)}`}
                                    className={`${styles.filterBtn} ${currentSubtype === subtype ? styles.active : ''}`}
                                    style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}
                                >
                                    {subtype}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
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
        </main>
    );
}
