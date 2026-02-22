import EventCard from '../../components/EventCard';
import styles from './page.module.css';
import Link from 'next/link';

export const metadata = {
    title: 'Tüm Etkinlikler - ExploreKadikoy',
    description: 'Kadıköy\'deki tüm etkinlikleri keşfedin. Konserler, tiyatrolar, sergiler ve atölyeler.',
};

export default function EtkinliklerPage() {
    const events = [
        { id: '1', title: 'Kadıköy Sokak Sanatı Turu', category: 'Tur', venue: 'Moda Sahili', time: '14:00', date: 'Bugün', isFree: true, slug: 'kadikoy-sokak-sanati-turu' },
        { id: '2', title: 'Alternatif Rock Gecesi: Yüzyüzeyken Konuşuruz', category: 'Konser', venue: 'Dorock XL', time: '21:00', date: 'Bugün', isFree: false, slug: 'yuzyuzeyken-konusuruz-konseri' },
        { id: '3', title: 'Coffee Festival 2026', category: 'Festival', venue: 'Müze Gazhane', time: '10:00 - 18:00', date: 'Yarın', isFree: false, slug: 'coffee-festival-2026' },
        { id: '4', title: 'Açık Mikrofon Stand-up', category: 'Stand-up', venue: 'Karga Bar', time: '20:30', date: 'Cuma', isFree: true, slug: 'acik-mikrofon-karga' },
        { id: '5', title: 'Suluboya Atölyesi', category: 'Atölye', venue: 'Tasarım Bakkalı', time: '15:00', date: 'Cumartesi', isFree: false, slug: 'suluboya-atolyesi' },
        { id: '6', title: 'Moda Sahnesi: Hamlet', category: 'Tiyatro', venue: 'Moda Sahnesi', time: '20:00', date: 'Pazar', isFree: false, slug: 'hamlet-moda-sahnesi' },
    ];

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Tüm Etkinlikler</h1>
                    <p className={styles.subtitle}>Kadıköy'de keşfedilecek düzinelerce etkinlik seni bekliyor.</p>
                </div>

                {/* Placeholder Filters component */}
                <div className={styles.filtersWrapper}>
                    <div className={styles.filtersScroll}>
                        <button className={`${styles.filterBtn} ${styles.active}`}>Tümü</button>
                        <button className={styles.filterBtn}>Bugün</button>
                        <button className={styles.filterBtn}>Bu Hafta</button>
                        <button className={styles.filterBtn}>Ücretsiz</button>
                        <div className={styles.divider}></div>
                        <button className={styles.filterBtn}>Konser</button>
                        <button className={styles.filterBtn}>Tiyatro</button>
                        <button className={styles.filterBtn}>Sergi</button>
                        <button className={styles.filterBtn}>Atölye</button>
                    </div>
                </div>
            </header>

            <section className={styles.results}>
                <div className={styles.resultsInfo}>
                    <p><span>6 etkinlik</span> bulundu</p>
                    <div className={styles.sort}>
                        <select className={styles.select}>
                            <option>Yaklaşanlar</option>
                            <option>Ücretsizler Önce</option>
                            <option>A-Z</option>
                        </select>
                    </div>
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
