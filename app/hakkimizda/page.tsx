import styles from '../etkinlikler/page.module.css';

export const metadata = {
    title: 'Hakkımızda - ExploreKadikoy',
    description: 'ExploreKadikoy nedir? Kadıköy\'ün en dinamik kültür sanat platformu hakkında bilgi edinin.',
};

export default function HakkimizdaPage() {
    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Biz Kimiz?</h1>
                    <p className={styles.subtitle}>Kadıköy'ün kültürel nabzını tutan platform.</p>
                </div>
            </header>

            <section style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.1rem', paddingBottom: '4rem' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                    <strong>ExploreKadıköy</strong>, İstanbul'un en canlı, en renkli ve en üretken ilçesi Kadıköy'ün kültür, sanat ve eğlence yaşamını tek bir çatı altında toplayan rehberinizdir.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                    Amacımız; Kadıköy'ün dar sokaklarındaki gizli sahnelerden en büyük açık hava konser alanlarına, yerel sanatçıların sergilerinden ilham verici atölyelere kadar her türlü etkinliği kolayca keşfedilebilir kılmaktır.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                    Kadıköy sadece bir ilçe değil, bir yaşam tarzıdır. Biz de bu yaşam tarzını dijital dünyada en iyi şekilde temsil etmeye çalışıyoruz.
                </p>
                <h3 style={{ color: 'white', marginTop: '3rem', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>Vizyonumuz</h3>
                <p>
                    Kadıköy'deki tüm sanatçıları, mekanları ve sanatseverleri bir araya getiren bağımsız, yenilikçi ve kapsayıcı bir topluluk yaratmak. Kültür sanat ekosistemini dijitalleştirerek herkes için erişilebilir kılmak.
                </p>
            </section>
        </main>
    );
}
