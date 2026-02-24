import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f0f11' }}>
            {/* Sidebar */}
            <aside style={{ width: '250px', backgroundColor: '#18181b', borderRight: '1px solid #27272a', padding: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white' }}>Admin Panel</h2>
                    <p style={{ fontSize: '0.875rem', color: '#a1a1aa' }}>ExploreKadikoy</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link href="/admin" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#e4e4e7', textDecoration: 'none', transition: 'background-color 0.2s', ...{ ':hover': { backgroundColor: '#27272a' } } }}>
                        Dashboard
                    </Link>
                    <Link href="/admin/events" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#e4e4e7', textDecoration: 'none', transition: 'background-color 0.2s' }}>
                        Etkinlikler
                    </Link>
                    <Link href="/admin/venues" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#e4e4e7', textDecoration: 'none', transition: 'background-color 0.2s' }}>
                        Mekanlar
                    </Link>
                    <Link href="/admin/guides" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#e4e4e7', textDecoration: 'none', transition: 'background-color 0.2s' }}>
                        Rehberler
                    </Link>
                    <a href="/" target="_blank" style={{ marginTop: 'auto', padding: '0.75rem 1rem', color: '#6366f1', textDecoration: 'none', fontSize: '0.875rem' }}>
                        Siteye Dön ↗
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
}
