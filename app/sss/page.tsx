import styles from '../etkinlikler/page.module.css';

export const metadata = {
    title: 'Sıkça Sorulan Sorular - ExploreKadikoy',
    description: 'ExploreKadıköy hakkında sıkça sorulan sorular ve cevapları.',
};

export default function SSSPage() {
    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Sıkça Sorulan Sorular</h1>
                    <p className={styles.subtitle}>İhtiyacınız olabilecek tüm cevaplar burada.</p>
                </div>
            </header>

            <section style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.1rem', paddingBottom: '4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                <div style={{ backgroundColor: '#18181b', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #27272a' }}>
                    <h3 style={{ color: 'white', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 600 }}>ExploreKadıköy ücretli mi?</h3>
                    <p>
                        Hayır, ExploreKadıköy'ü kullanmak ve etkinlikleri keşfetmek tamamen ücretsizdir. Etkinliklerin kendisi (konser biletleri vb.) ücretli veya ücretsiz olabilir; bu bilgi etkinlik detay sayfasında belirtilmektedir.
                    </p>
                </div>

                <div style={{ backgroundColor: '#18181b', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #27272a' }}>
                    <h3 style={{ color: 'white', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 600 }}>Kendi etkinliğimi nasıl ekleyebilirim?</h3>
                    <p>
                        Şu an için etkinlik eklemeleri sadece platform yönetimi tarafından yapılabilmektedir. Eğer Kadıköy'de gerçekleşecek bir etkinliğiniz varsa, "İletişim" sayfamız üzerinden bize ulaşarak detayları iletebilirsiniz.
                    </p>
                </div>

                <div style={{ backgroundColor: '#18181b', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #27272a' }}>
                    <h3 style={{ color: 'white', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 600 }}>Bilet satın alabilir miyim?</h3>
                    <p>
                        ExploreKadıköy bir biletleme platformu değildir. Sizi ilgili etkinliklerin resmi bilet satış sitelerine yönlendirir veya mekanların yönlendirmelerini paylaşır.
                    </p>
                </div>

                <div style={{ backgroundColor: '#18181b', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #27272a' }}>
                    <h3 style={{ color: 'white', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 600 }}>Profil oluşturmanın avantajları nelerdir?</h3>
                    <p>
                        Çok yakında gelecek "Favorilerim" ve "Gideceğim Etkinlikler" özellikleri sayesinde, sevdiğiniz mekanları ve katılmayı planladığınız etkinlikleri kendi profilinizde kolayca listeleyebileceksiniz.
                    </p>
                </div>

            </section>
        </main>
    );
}
