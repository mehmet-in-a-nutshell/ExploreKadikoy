export default function AdminDashboard() {
    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white' }}>ExploreKadikoy Yönetim Paneli</h1>
            <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>İçeriklerinizi yönetmek için sol menüyü kullanın.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Quick Stats Cards */}
                <div style={{ backgroundColor: '#18181b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #27272a' }}>
                    <h3 style={{ color: '#e4e4e7', marginBottom: '0.5rem' }}>Toplam Etkinlik</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>--</p>
                </div>
                <div style={{ backgroundColor: '#18181b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #27272a' }}>
                    <h3 style={{ color: '#e4e4e7', marginBottom: '0.5rem' }}>Kayıtlı Mekan</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>--</p>
                </div>
            </div>
        </div>
    );
}
