import { createClient } from '../../utils/supabase/server';
import { filterDistinctEvents } from '../../utils/eventFilter';

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

    // Fetch all events for distinct stats
    const { data: allEventsRaw } = await supabase
        .from('events')
        .select(`
            id, title, date, event_type,
            venues (name)
        `);

    const formattedEvents = (allEventsRaw || []).map((e: any) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        venue: e.venues?.name || 'Bilinmiyor',
        eventType: e.event_type || 'Belirtilmemiş'
    }));

    const distinctEvents = filterDistinctEvents(formattedEvents);

    // Group distinct events by venue
    const venueCounts = distinctEvents.reduce((acc: any, curr: any) => {
        if (curr.venue !== 'Bilinmiyor') {
            acc[curr.venue] = (acc[curr.venue] || 0) + 1;
        }
        return acc;
    }, {});

    const venueStats = Object.entries(venueCounts)
        .map(([name, count]) => ({ name, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    // Group distinct events by type
    const typeCounts = distinctEvents.reduce((acc: any, curr: any) => {
        acc[curr.eventType] = (acc[curr.eventType] || 0) + 1;
        return acc;
    }, {});

    const eventTypeStats = Object.entries(typeCounts)
        .map(([name, count]) => ({ name, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white' }}>ExploreKadikoy Yönetim Paneli</h1>
            <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>İçeriklerinizi yönetmek için sol menüyü kullanın.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                {/* Quick Stats Cards */}
                <div style={{ backgroundColor: '#18181b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #27272a' }}>
                    <h3 style={{ color: '#e4e4e7', marginBottom: '0.5rem' }}>Tekil Etkinlik (Distinct)</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{distinctEvents.length}</p>
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

            {/* Detailed Statistics Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginTop: '3rem' }}>

                {/* Top Venues by Event Count */}
                <div style={{ backgroundColor: '#18181b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #27272a' }}>
                    <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                        En Çok Etkinlik Düzenleyen 10 Mekan
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {venueStats.map((venue, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: index !== venueStats.length - 1 ? '1px solid #27272a' : 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span style={{ color: '#a1a1aa', fontWeight: 'bold', width: '20px' }}>{index + 1}.</span>
                                    <span style={{ color: '#e4e4e7' }}>{venue.name}</span>
                                </div>
                                <span style={{ backgroundColor: '#27272a', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', color: '#fbbf24', fontWeight: 'bold' }}>
                                    {venue.count} Etkinlik
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Event Types */}
                <div style={{ backgroundColor: '#18181b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #27272a' }}>
                    <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                        Etkinlik Tiplerine Göre Dağılım (İlk 10)
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {eventTypeStats.map((stat, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: index !== eventTypeStats.length - 1 ? '1px solid #27272a' : 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span style={{ color: '#a1a1aa', fontWeight: 'bold', width: '20px' }}>{index + 1}.</span>
                                    <span style={{ color: '#e4e4e7' }}>{stat.name}</span>
                                </div>
                                <span style={{ backgroundColor: '#27272a', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', color: '#6366f1', fontWeight: 'bold' }}>
                                    {stat.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
}
