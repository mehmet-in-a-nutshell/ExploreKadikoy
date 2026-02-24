import { createClient } from '../../utils/supabase/server';

export const revalidate = 0; // Always fetch fresh data in admin dashboard

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch total events
    const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });

    // Fetch total venues
    const { count: venuesCount } = await supabase
        .from('venues')
        .select('*', { count: 'exact', head: true });

    // Fetch total guides
    const { count: guidesCount } = await supabase
        .from('guides')
        .select('*', { count: 'exact', head: true });

    // Fetch top rated venues count
    const { count: topVenuesCount } = await supabase
        .from('venues')
        .select('*', { count: 'exact', head: true })
        .gte('rating', 4.0);

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white' }}>ExploreKadikoy Yönetim Paneli</h1>
            <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>İçeriklerinizi yönetmek için sol menüyü kullanın.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                {/* Quick Stats Cards */}
                <div style={{ backgroundColor: '#18181b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #27272a' }}>
                    <h3 style={{ color: '#e4e4e7', marginBottom: '0.5rem' }}>Toplam Etkinlik</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{eventsCount || 0}</p>
                </div>
                <div style={{ backgroundColor: '#18181b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #27272a' }}>
                    <h3 style={{ color: '#e4e4e7', marginBottom: '0.5rem' }}>Kayıtlı Mekan</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{venuesCount || 0}</p>
                </div>
                <div style={{ backgroundColor: '#18181b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #27272a' }}>
                    <h3 style={{ color: '#e4e4e7', marginBottom: '0.5rem' }}>Şehir Rehberi</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{guidesCount || 0}</p>
                </div>
                <div style={{ backgroundColor: '#18181b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #27272a' }}>
                    <h3 style={{ color: '#e4e4e7', marginBottom: '0.5rem' }}>Popüler Mekanlar (4.0+ ⭐)</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{topVenuesCount || 0}</p>
                </div>
            </div>
        </div>
    );
}
