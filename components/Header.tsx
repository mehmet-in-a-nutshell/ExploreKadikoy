import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={`${styles.header} glass`}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href="/">
                        Explore<span className="text-gradient">Kadıköy</span>
                    </Link>
                </div>

                <nav className={styles.nav}>
                    <ul className={styles.navList}>
                        <li><Link href="/bugun" className={styles.navLink}>Bugün</Link></li>
                        <li><Link href="/etkinlikler" className={styles.navLink}>Tüm Etkinlikler</Link></li>
                        <li><Link href="/mekanlar" className={styles.navLink}>Mekanlar</Link></li>
                        <li><Link href="/rehber" className={styles.navLink}>Rehber</Link></li>
                    </ul>
                </nav>

                <div className={styles.actions}>
                    <button className={styles.ctaBtn}>Giriş Yap</button>
                </div>
            </div>
        </header>
    );
}
