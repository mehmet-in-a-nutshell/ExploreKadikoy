"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MobileMenu.module.css';

interface User {
    email?: string;
}

interface MobileMenuProps {
    user: User | null;
}

export default function MobileMenu({ user }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <div className={styles.mobileMenuContainer}>
            <button
                className={styles.hamburgerBtn}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
            >
                <div className={`${styles.hamburgerLine} ${isOpen ? styles.lineTop : ''}`}></div>
                <div className={`${styles.hamburgerLine} ${isOpen ? styles.lineMiddle : ''}`}></div>
                <div className={`${styles.hamburgerLine} ${isOpen ? styles.lineBottom : ''}`}></div>
            </button>

            {isOpen && (
                <div className={styles.overlay} onClick={() => setIsOpen(false)}></div>
            )}

            <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
                <div className={styles.drawerHeader}>
                    <div className={styles.logo}>
                        Explore<span className="text-gradient">Kadıköy</span>
                    </div>
                    <button
                        className={styles.closeBtn}
                        onClick={() => setIsOpen(false)}
                        aria-label="Close menu"
                    >
                        ×
                    </button>
                </div>

                <nav className={styles.drawerNav}>
                    <ul className={styles.drawerNavList}>
                        <li><Link href="/bugun" className={styles.drawerNavLink}>🔥 Bugün</Link></li>
                        <li><Link href="/etkinlikler" className={styles.drawerNavLink}>🗓 Tüm Etkinlikler</Link></li>
                        <li><Link href="/mekanlar" className={styles.drawerNavLink}>📍 Mekanlar</Link></li>
                        <li><Link href="/rehber" className={styles.drawerNavLink}>🗺 Rehber</Link></li>
                    </ul>
                </nav>

                <div className={styles.drawerActions}>
                    {user ? (
                        <>
                            {user.email?.toLowerCase() === 'admin@explorekadikoy.com' ? (
                                <Link href="/admin" className={styles.drawerNavLink} style={{ fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '1rem', display: 'block' }}>Admin Paneli</Link>
                            ) : null}
                            <Link href="/profile" className={styles.profileBtn}>Profilim</Link>
                            <form action="/auth/logout" method="post">
                                <button type="submit" className={styles.logoutBtn}>Çıkış Yap</button>
                            </form>
                        </>
                    ) : (
                        <div className={styles.authButtons}>
                            <Link href="/login" className={styles.loginBtn}>Giriş Yap</Link>
                            <Link href="/register" className={styles.registerBtn}>Üye Ol</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
