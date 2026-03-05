import { createClient } from '../../../utils/supabase/server';
import Link from 'next/link';
import ClientEventTable from './ClientEventTable';

export const revalidate = 0; // Always fetch fresh data in admin

export default async function AdminEventsList() {
    const supabase = await createClient();
    const { data: rawEvents } = await supabase.from('events').select(`
    id, title, date, time, is_free, event_type, event_subtype,
    venues:venue_id (name)
  `).order('date', { ascending: false });

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

            <ClientEventTable initialEvents={rawEvents || []} />
        </div>
    );
}
