'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminDeleteButton from '../../../components/AdminDeleteButton';

export default function ClientVenueTable({ initialVenues }: { initialVenues: any[] }) {
    const [searchName, setSearchName] = useState('');
    const [searchNeighborhood, setSearchNeighborhood] = useState('');

    const filteredVenues = initialVenues.filter(venue => {
        const matchName = venue.name.toLowerCase().includes(searchName.toLowerCase());
        const matchNeighborhood = (venue.neighborhood || '').toLowerCase().includes(searchNeighborhood.toLowerCase());
        return matchName && matchNeighborhood;
    });

    return (
        <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexDirection: 'row', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 250px' }}>
                    <input
                        type="text"
                        placeholder="Mekan adına göre ara..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white', outline: 'none' }}
                    />
                </div>
                <div style={{ flex: '1 1 250px' }}>
                    <input
                        type="text"
                        placeholder="Semte göre ara..."
                        value={searchNeighborhood}
                        onChange={(e) => setSearchNeighborhood(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white', outline: 'none' }}
                    />
                </div>
            </div>

            <div style={{ backgroundColor: '#18181b', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #27272a' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', color: '#e4e4e7' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#27272a', borderBottom: '1px solid #3f3f46' }}>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Mekan Adı</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Semt (Mahalle)</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Tip</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Puan</th>
                            <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVenues.map((venue: any) => (
                            <tr key={venue.id} style={{ borderBottom: '1px solid #27272a' }}>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{venue.name}</td>
                                <td style={{ padding: '1rem', color: '#a1a1aa' }}>{venue.neighborhood || '-'}</td>
                                <td style={{ padding: '1rem', color: '#c084fc' }}>{venue.venue_type || '-'}</td>
                                <td style={{ padding: '1rem', color: '#fbbf24', fontWeight: 500 }}>{venue.rating ? `⭐ ${venue.rating}` : <span style={{ color: '#71717a' }}>-</span>}</td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                        <Link href={`/admin/venues/edit/${venue.id}`} style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.875rem' }}>Düzenle</Link>
                                        <AdminDeleteButton id={venue.id} table="venues" title={venue.name} />
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {filteredVenues.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#71717a' }}>
                                    {initialVenues.length === 0 ? 'Henüz hiç mekan eklenmemiş.' : 'Aradığınız kriterlere uygun mekan bulunamadı.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
