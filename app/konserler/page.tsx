import EventCard from '../../components/EventCard';
import styles from '../etkinlikler/page.module.css';

export const metadata = {
    title: 'Kadıköy Konserleri - ExploreKadikoy',
    description: 'Kadıköy\'deki güncel konserleri, canlı müzik mekanlarını ve alternatif sahneleri keşfedin.',
};

export default function KonserlerPage() {
    const events = [
        { id: '2', title: 'Alternatif Rock Gecesi: Yüzyüzeyken Konuşuruz', category: 'Konser', venue: 'Dorock XL', time: '21:00', date: 'Bugün', isFree: false, slug: 'yuzyuzeyken-konusuruz-konseri' },
        { id: '8', title: 'Duman Konseri', category: 'Konser', venue: 'Bostancı Gösteri Merkezi', time: '20:00', date: 'Cuma', isFree: false, slug: 'duman-bgm' },
    ];

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Konserler</h1>
                    <p className={styles.subtitle}>En iyi sesler, en iyi mekanlar Kadıköy sahnesinde buluşuyor.</p>
                </div>
            </header>

            <section className={styles.results}>
                <div className={styles.resultsInfo}>
                    <p><span>{events.length} konser</span> bulundu</p>
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
