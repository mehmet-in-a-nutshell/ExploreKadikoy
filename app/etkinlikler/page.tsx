import EventCard from '../../components/EventCard';
import styles from './page.module.css';
import Link from 'next/link';

export const metadata = {
    title: 'Tüm Etkinlikler - ExploreKadikoy',
    description: 'Kadıköy\'deki tüm etkinlikleri keşfedin. Konserler, tiyatrolar, sergiler ve atölyeler.',
};

export default async function EtkinliklerPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; filter?: string; sort?: string }>
}) {
    const params = await searchParams;
    const allEvents = [
        { id: '1', title: 'Kadıköy Sokak Sanatı Turu', category: 'Tur', venue: 'Moda Sahili', time: '14:00', date: 'Bugün', isFree: true, slug: 'kadikoy-sokak-sanati-turu' },
        { id: '2', title: 'Alternatif Rock Gecesi: Yüzyüzeyken Konuşuruz', category: 'Konser', venue: 'Dorock XL', time: '21:00', date: 'Bugün', isFree: false, slug: 'yuzyuzeyken-konusuruz-konseri' },
        { id: '3', title: 'Coffee Festival 2026', category: 'Festival', venue: 'Müze Gazhane', time: '10:00 - 18:00', date: 'Yarın', isFree: false, slug: 'coffee-festival-2026' },
        { id: '4', title: 'Açık Mikrofon Stand-up', category: 'Stand-up', venue: 'Karga Bar', time: '20:30', date: 'Cuma', isFree: true, slug: 'acik-mikrofon-karga' },
        { id: '5', title: 'Suluboya Atölyesi', category: 'Atölye', venue: 'Tasarım Bakkalı', time: '15:00', date: 'Cumartesi', isFree: false, slug: 'suluboya-atolyesi' },
        { id: '6', title: 'Moda Sahnesi: Hamlet', category: 'Tiyatro', venue: 'Moda Sahnesi', time: '20:00', date: 'Pazar', isFree: false, slug: 'hamlet-moda-sahnesi' },
    ];

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
        events = events.filter(e => e.date === 'Bugün');
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
