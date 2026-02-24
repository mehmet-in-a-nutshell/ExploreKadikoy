import styles from '../etkinlikler/page.module.css';

export const metadata = {
    title: 'İletişim - ExploreKadikoy',
    description: 'ExploreKadikoy ekibiyle iletişime geçin.',
};

export default function IletisimPage() {
    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>İletişim</h1>
                    <p className={styles.subtitle}>Bize ulaşın, etkinlik önerin veya soru sorun.</p>
                </div>
            </header>

            <section style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.1rem', paddingBottom: '4rem' }}>
                <div style={{ backgroundColor: '#18181b', padding: '2rem', borderRadius: '1rem', border: '1px solid #27272a', marginBottom: '3rem' }}>
                    <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>Bize Ulaşın</h3>
                    <p style={{ marginBottom: '1rem' }}>
                        Genel sorular, işbirlikleri veya geri bildirimleriniz için bize her zaman e-posta yoluyla ulaşabilirsiniz:
                    </p>
                    <a href="mailto:info@explorekadikoy.com" style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '1.25rem', textDecoration: 'none' }}>
                        info@explorekadikoy.com
                    </a>
                </div>

                <div style={{ backgroundColor: '#18181b', padding: '2rem', borderRadius: '1rem', border: '1px solid #27272a' }}>
                    <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>Etkinlik Ekleme Talebi</h3>
                    <p>
                        Mekanınızda veya ekibinizle düzenlediğiniz bir etkinliğin ExploreKadıköy'de yer almasını istiyorsanız, etkinlik detaylarını, afişini ve ilgili linkleri bize mail yoluyla iletebilirsiniz. Ekibimiz en kısa sürede değerlendirip platforma ekleyecektir.
                    </p>
                </div>
            </section>
        </main>
    );
}
