import EventCard from '../../components/EventCard';
import styles from '../etkinlikler/page.module.css';

export const metadata = {
    title: 'Kadıköy Tiyatro Oyunları - ExploreKadikoy',
    description: 'Moda Sahnesi, Baba Sahne, Oyun Atölyesi ve daha fazlasındaki güncel tiyatro oyunları.',
};

export default function TiyatroPage() {
    const events = [
        { id: '6', title: 'Moda Sahnesi: Hamlet', category: 'Tiyatro', venue: 'Moda Sahnesi', time: '20:00', date: 'Pazar', isFree: false, slug: 'hamlet-moda-sahnesi' },
        { id: '9', title: 'Bir Baba Hamlet', category: 'Tiyatro', venue: 'Baba Sahne', time: '20:30', date: 'Cuma', isFree: false, slug: 'bir-baba-hamlet' },
    ];

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Tiyatro</h1>
                    <p className={styles.subtitle}>Kadıköy sahnelerindeki en güncel oyunlar.</p>
                </div>
            </header>

            <section className={styles.results}>
                <div className={styles.resultsInfo}>
                    <p><span>{events.length} tiyatro oyunu</span> bulundu</p>
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
