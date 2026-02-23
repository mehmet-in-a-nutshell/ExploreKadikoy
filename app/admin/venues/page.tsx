import { supabase } from '../../../utils/supabase';
import Link from 'next/link';

export const revalidate = 0; // Always fetch fresh data in admin

export default async function AdminVenuesList() {
    const { data: rawVenues } = await supabase.from('venues').select('*').order('created_at', { ascending: false });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>Mekanları Yönet</h1>
                <Link
                    href="/admin/venues/new"
                    style={{ backgroundColor: '#6366f1', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 500 }}
                >
                    + Yeni Mekan Ekle
                </Link>
            </div>

            <div style={{ backgroundColor: '#18181b', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #27272a' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', color: '#e4e4e7' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#27272a', borderBottom: '1px solid #3f3f46' }}>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Mekan Adı</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Semt (Mahalle)</th>
                            <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(rawVenues || []).map((venue: any) => (
                            <tr key={venue.id} style={{ borderBottom: '1px solid #27272a' }}>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{venue.name}</td>
                                <td style={{ padding: '1rem', color: '#a1a1aa' }}>{venue.neighborhood || '-'}</td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.875rem' }}>Sil</button>
                                </td>
                            </tr>
                        ))}

                        {rawVenues?.length === 0 && (
                            <tr>
                                <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#71717a' }}>
                                    Henüz hiç mekan eklenmemiş.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
