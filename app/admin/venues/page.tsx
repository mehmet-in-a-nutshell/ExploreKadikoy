import { createClient } from '../../../utils/supabase/server';
import Link from 'next/link';
import ClientVenueTable from './ClientVenueTable';

export const revalidate = 0; // Always fetch fresh data in admin

export default async function AdminVenuesList() {
    const supabase = await createClient();
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

            <ClientVenueTable initialVenues={rawVenues || []} />
        </div>
    );
}
