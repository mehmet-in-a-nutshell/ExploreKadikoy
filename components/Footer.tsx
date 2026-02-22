import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.topSection}>
                    <div className={styles.brand}>
                        <h2>Explore<span className="text-gradient">Kadıköy</span></h2>
                        <p>Kadıköy'ün en kapsamlı etkinlik ve mekan keşif platformu.</p>
                    </div>

                    <div className={styles.linksGrid}>
                        <div className={styles.linkColumn}>
                            <h3>Keşfet</h3>
                            <ul>
                                <li><Link href="/bugun">Bugün</Link></li>
                                <li><Link href="/bu-hafta">Bu Hafta</Link></li>
                                <li><Link href="/ucretsiz-etkinlikler">Ücretsiz Etkinlikler</Link></li>
                            </ul>
                        </div>

                        <div className={styles.linkColumn}>
                            <h3>Kategoriler</h3>
                            <ul>
                                <li><Link href="/konserler"> Konserler</Link></li>
                                <li><Link href="/tiyatro">Tiyatro</Link></li>
                                <li><Link href="/sergiler">Sergiler</Link></li>
                            </ul>
                        </div>

                        <div className={styles.linkColumn}>
                            <h3>Hakkımızda</h3>
                            <ul>
                                <li><Link href="/iletisim">İletişim</Link></li>
                                <li><Link href="/hakkimizda">Biz Kimiz?</Link></li>
                                <li><Link href="/sss">S.S.S</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.bottomSection}>
                    <p>&copy; {new Date().getFullYear()} ExploreKadikoy. Tüm hakları saklıdır.</p>
                    <div className={styles.socials}>
                        <a href="#" aria-label="Instagram">IG</a>
                        <a href="#" aria-label="Twitter">TW</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
