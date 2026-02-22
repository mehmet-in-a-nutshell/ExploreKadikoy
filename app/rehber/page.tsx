import GuideCard from '../../components/GuideCard';
import styles from '../etkinlikler/page.module.css';

export const metadata = {
    title: 'Kadıköy Keşif Rehberi - ExploreKadikoy',
    description: 'Kadıköy\'ü bir lokal gibi yaşayın. Rotalar, yeme-içme listeleri ve gizli noktalar.',
};

export default function RehberPage() {
    const guides = [
        { id: 'g1', title: 'Kadıköy Kahve Rehberi: En İyi 10 Mekan', excerpt: 'Moda\'dan Yeldeğirmeni\'ne Kadıköy\'ün en iyi 3., nesil kahvecilerini sizin için derledik.', readTime: '5', slug: 'kadikoy-kahve-rehberi' },
        { id: 'g2', title: 'Yağmurlu Günde Kadıköy\'de Ne Yapılır?', excerpt: 'Havalar soğudu diye eve kapanmak yok! Kapalı mekanlarda keşfetmeniz gereken 7 harika aktivite.', readTime: '3', slug: 'yagmurlu-gunde-kadikoy' },
        { id: 'g3', title: 'Moda Sahili Yürüyüş Rotası', excerpt: 'Yoğurtçu Parkı\'ndan başlayıp Kalamış\'a uzanan en keyifli yürüyüş ve mola durakları.', readTime: '4', slug: 'moda-sahili-rota' },
    ];

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Rehber</h1>
                    <p className={styles.subtitle}>Şehri bizimle adım adım keşfedin.</p>
                </div>
            </header>

            <section className={styles.results}>
                <div className={styles.resultsInfo}>
                    <p><span>{guides.length} keşif rehberi</span> bulundu</p>
                </div>

                {/* We use a different layout for guides, maybe similar to the 2 cols on homepage */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
                    {guides.map((guide) => (
                        <GuideCard key={guide.id} {...guide} />
                    ))}
                </div>
            </section>
        </main>
    );
}
