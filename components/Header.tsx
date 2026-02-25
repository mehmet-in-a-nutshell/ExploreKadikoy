import Link from 'next/link';
import styles from './Header.module.css';
import MobileMenu from './MobileMenu';

import { createClient } from '../utils/supabase/server';

export default async function Header() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

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
                    {user ? (
                        <>
                            {user.email?.toLowerCase() === 'admin@explorekadikoy.com' ? (
                                <Link href="/admin" className={styles.navLink} style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>Admin Paneli</Link>
                            ) : (
                                <Link href="/profile" className={styles.navLink} style={{ fontWeight: 'bold', color: 'white' }}>Profilim</Link>
                            )}
                            <form action="/auth/logout" method="post">
                                <button type="submit" className={styles.ctaBtn} style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>Çıkış Yap</button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className={styles.navLink}>Giriş Yap</Link>
                            <Link href="/register" className={styles.ctaBtn}>Üye Ol</Link>
                        </>
                    )}
                </div>

                <MobileMenu user={user ? { email: user.email } : null} />
            </div>
        </header>
    );
}
