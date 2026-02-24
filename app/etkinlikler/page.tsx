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

export default async function EtkinliklerPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; filter?: string; sort?: string }>
}) {
    const params = await searchParams;

    const { data: rawEvents } = await supabase.from('events').select(`
        id, title, slug, date, time, is_free, cover_image, description,
        venues:venue_id (name),
        categories:category_id (name)
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
        category: e.categories?.name || 'Diğer'
    }));

    // Read current searchParams
    const currentCategory = params.category || 'Tümü';
    const currentFilter = params.filter || 'Tümü';
    const currentSort = params.sort || 'Yaklaşanlar';

    // Apply filtering
    let events = [...allEvents];

    if (currentCategory !== 'Tümü') {
        events = events.filter(e => e.category.toLowerCase() === currentCategory.toLowerCase());
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
                        {['Konser', 'Tiyatro', 'Sergi', 'Atölye', 'Stand-up'].map(cat => (
                            <Link
                                key={cat}
                                href={`/etkinlikler?category=${cat}`}
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
        </main>
    );
}
