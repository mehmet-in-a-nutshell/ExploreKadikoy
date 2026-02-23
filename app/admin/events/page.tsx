import { supabase } from '../../../utils/supabase';
import Link from 'next/link';

export const revalidate = 0; // Always fetch fresh data in admin

export default async function AdminEventsList() {
    const { data: rawEvents } = await supabase.from('events').select(`
    id, title, date, time, is_free,
    venues:venue_id (name)
  `).order('created_at', { ascending: false });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>Etkinlikleri Yönet</h1>
                <Link
                    href="/admin/events/new"
                    style={{ backgroundColor: '#6366f1', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 500 }}
                >
                    + Yeni Etkinlik Ekle
                </Link>
            </div>

            <div style={{ backgroundColor: '#18181b', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #27272a' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', color: '#e4e4e7' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#27272a', borderBottom: '1px solid #3f3f46' }}>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Etkinlik Adı</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Mekan</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Tarih / Saat</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Türü</th>
                            <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(rawEvents || []).map((event: any) => (
                            <tr key={event.id} style={{ borderBottom: '1px solid #27272a' }}>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{event.title}</td>
                                <td style={{ padding: '1rem', color: '#a1a1aa' }}>{event.venues?.name || '-'}</td>
                                <td style={{ padding: '1rem', color: '#a1a1aa' }}>{event.date} - {event.time}</td>
                                <td style={{ padding: '1rem' }}>
                                    {event.is_free ? (
                                        <span style={{ backgroundColor: '#064e3b', color: '#34d399', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem' }}>Ücretsiz</span>
                                    ) : (
                                        <span style={{ backgroundColor: '#1e3a8a', color: '#93c5fd', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem' }}>Biletli</span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.875rem' }}>Sil</button>
                                </td>
                            </tr>
                        ))}

                        {rawEvents?.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#71717a' }}>
                                    Henüz hiç etkinlik eklenmemiş.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
