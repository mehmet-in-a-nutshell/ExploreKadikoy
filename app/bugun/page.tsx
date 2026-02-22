import EventCard from '../../components/EventCard';
import styles from '../etkinlikler/page.module.css';

export const metadata = {
    title: 'Bugün Kadıköy\'de Neler Var? - ExploreKadikoy',
    description: 'Kadıköy\'de bugün gerçekleşecek konser, tiyatro, atölye ve sergi etkinlikleri.',
};

export default function BugunPage() {
    const events = [
        { id: '1', title: 'Kadıköy Sokak Sanatı Turu', category: 'Tur', venue: 'Moda Sahili', time: '14:00', date: 'Bugün', isFree: true, slug: 'kadikoy-sokak-sanati-turu' },
        { id: '2', title: 'Alternatif Rock Gecesi: Yüzyüzeyken Konuşuruz', category: 'Konser', venue: 'Dorock XL', time: '21:00', date: 'Bugün', isFree: false, slug: 'yuzyuzeyken-konusuruz-konseri' },
    ];

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Bugün Neler Var?</h1>
                    <p className={styles.subtitle}>Kadıköy'de bugün nefes kesen etkinlikleri kaçırmayın.</p>
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
