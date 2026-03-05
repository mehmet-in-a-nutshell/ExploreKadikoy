'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminDeleteButton from '../../../components/AdminDeleteButton';

export default function ClientEventTable({ initialEvents }: { initialEvents: any[] }) {
    const [searchTitle, setSearchTitle] = useState('');
    const [searchVenue, setSearchVenue] = useState('');

    const filteredEvents = initialEvents.filter(event => {
        const matchTitle = event.title.toLowerCase().includes(searchTitle.toLowerCase());
        const matchVenue = (event.venues?.name || '').toLowerCase().includes(searchVenue.toLowerCase());
        return matchTitle && matchVenue;
    });

    return (
        <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexDirection: 'row', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 250px' }}>
                    <input
                        type="text"
                        placeholder="Etkinlik adına göre ara..."
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white', outline: 'none' }}
                    />
                </div>
                <div style={{ flex: '1 1 250px' }}>
                    <input
                        type="text"
                        placeholder="Mekan adına göre ara..."
                        value={searchVenue}
                        onChange={(e) => setSearchVenue(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white', outline: 'none' }}
                    />
                </div>
            </div>

            <div style={{ backgroundColor: '#18181b', borderRadius: '0.5rem', overflow: 'auto', border: '1px solid #27272a' }}>
                <table style={{ width: '100%', minWidth: '800px', textAlign: 'left', borderCollapse: 'collapse', color: '#e4e4e7' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#27272a', borderBottom: '1px solid #3f3f46' }}>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Etkinlik Adı</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Mekan</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Tarih / Saat</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Etkinlik Tipi</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Türü</th>
                            <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.map((event: any) => (
                            <tr key={event.id} style={{ borderBottom: '1px solid #27272a' }}>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{event.title}</td>
                                <td style={{ padding: '1rem', color: '#a1a1aa' }}>{event.venues?.name || '-'}</td>
                                <td style={{ padding: '1rem', color: '#a1a1aa' }}>{event.date} - {event.time}</td>
                                <td style={{ padding: '1rem', color: '#c084fc' }}>
                                    {event.event_type ? (
                                        <span>
                                            {event.event_type}
                                            {event.event_subtype && <span style={{ color: '#a1a1aa', fontSize: '0.875rem' }}> / {event.event_subtype}</span>}
                                        </span>
                                    ) : (
                                        <span style={{ color: '#71717a' }}>-</span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {event.is_free ? (
                                        <span style={{ backgroundColor: '#064e3b', color: '#34d399', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem' }}>Ücretsiz</span>
                                    ) : (
                                        <span style={{ backgroundColor: '#1e3a8a', color: '#93c5fd', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem' }}>Biletli</span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                        <Link href={`/admin/events/edit/${event.id}`} style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.875rem' }}>Düzenle</Link>
                                        <AdminDeleteButton id={event.id} table="events" title={event.title} />
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {filteredEvents.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#71717a' }}>
                                    {initialEvents.length === 0 ? 'Henüz hiç etkinlik eklenmemiş.' : 'Aradığınız kriterlere uygun etkinlik bulunamadı.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
