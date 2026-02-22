import EventCard from '../../components/EventCard';
import styles from '../etkinlikler/page.module.css';

export const metadata = {
    title: 'Ücretsiz Etkinlikler - ExploreKadikoy',
    description: 'Kadıköy\'de katılabileceğiniz ücretsiz konser, atölye ve sergi etkinlikleri.',
};

export default function UcretsizPage() {
    const events = [
        { id: '1', title: 'Kadıköy Sokak Sanatı Turu', category: 'Tur', venue: 'Moda Sahili', time: '14:00', date: 'Bugün', isFree: true, slug: 'kadikoy-sokak-sanati-turu' },
        { id: '4', title: 'Açık Mikrofon Stand-up', category: 'Stand-up', venue: 'Karga Bar', time: '20:30', date: 'Cuma', isFree: true, slug: 'acik-mikrofon-karga' },
    ];

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
                    <p><span>{events.length} ücretsiz etkinlik</span> bulundu</p>
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
