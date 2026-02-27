'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../../../utils/supabase/client';
import { useRouter } from 'next/navigation';
import { EVENT_TAXONOMY } from '../../../../utils/taxonomies';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { tr } from 'date-fns/locale';
import { format, parseISO, addDays } from 'date-fns';

export default function NewEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [venues, setVenues] = useState<any[]>([]);
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrenceWeeks, setRecurrenceWeeks] = useState(4);

    const supabase = createClient();

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category_id: null as any,
        event_type: '',
        event_subtype: '',
        venue_id: '',
        date: '',
        time: '',
        is_free: false,
        cover_image: '',
        description: ''
    });

    useEffect(() => {
        async function fetchData() {
            const [{ data: catData }, { data: venData }] = await Promise.all([
                supabase.from('categories').select('*'),
                supabase.from('venues').select('*')
            ]);
            if (catData) setCategories(catData);
            if (venData) setVenues(venData);
        }
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;

        // Auto-generate slug from title
        if (e.target.name === 'title' && !formData.slug) {
            const slug = e.target.value.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
            setFormData(prev => ({ ...prev, title: e.target.value, slug }));
        } else {
            setFormData(prev => ({ ...prev, [e.target.name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const eventsToInsert = [];
            const baseDate = parseISO(formData.date);

            let totalWeeks = isRecurring ? recurrenceWeeks : 1;

            for (let i = 0; i < totalWeeks; i++) {
                const eventDate = addDays(baseDate, i * 7);
                const formattedDate = format(eventDate, 'yyyy-MM-dd');

                // Create a unique slug for recurring events (append date) to avoid conflicts
                const eventSlug = i === 0 ? formData.slug : `${formData.slug}-${formattedDate}`;

                const baseData = { ...formData };
                if (baseData.venue_id === '') baseData.venue_id = null as any;
                if (baseData.category_id === '') baseData.category_id = null as any;

                eventsToInsert.push({
                    ...baseData,
                    date: formattedDate,
                    slug: eventSlug
                });
            }

            const { error } = await supabase.from('events').insert(eventsToInsert);
            if (error) throw error;
            alert('Etkinlik başarıyla eklendi!');
            router.push('/admin/events');
            router.refresh();
        } catch (error: any) {
            alert('Hata: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '2rem' }}>Yeni Etkinlik Ekle</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#18181b', padding: '2rem', borderRadius: '0.5rem', border: '1px solid #27272a' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Etkinlik Adı *</label>
                        <input required name="title" value={formData.title} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>URL (Slug) *</label>
                        <input required name="slug" value={formData.slug} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Etkinlik Tipi *</label>
                        <select required name="event_type" value={formData.event_type} onChange={(e) => {
                            handleChange(e);
                            setFormData(prev => ({ ...prev, event_type: e.target.value, event_subtype: '' }));
                        }} style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white', appearance: 'none' }}>
                            <option value="" disabled>Etkinlik tipi seçin</option>
                            {Object.keys(EVENT_TAXONOMY).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Alt Tür *</label>
                        <select required name="event_subtype" value={formData.event_subtype} onChange={handleChange} disabled={!formData.event_type} style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white', opacity: formData.event_type ? 1 : 0.5, appearance: 'none' }}>
                            <option value="" disabled>Alt tür seçin</option>
                            {formData.event_type && EVENT_TAXONOMY[formData.event_type]?.map((subtype: string) => (
                                <option key={subtype} value={subtype}>{subtype}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Mekan</label>
                    <select name="venue_id" value={formData.venue_id} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white', appearance: 'none' }}>
                        <option value="">Seçiniz...</option>
                        {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Tarih *</label>
                        <DatePicker
                            selected={formData.date ? new Date(formData.date) : null}
                            onChange={(date: Date | null) => setFormData(prev => ({ ...prev, date: date ? format(date, 'yyyy-MM-dd') : '' }))}
                            dateFormat="dd MMMM yyyy"
                            locale={tr}
                            placeholderText="Takvimden seçin"
                            className="date-picker-input"
                            wrapperClassName="date-picker-wrapper"
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Saat (Örn: 21:00)</label>
                        <input name="time" value={formData.time} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white' }} />
                    </div>
                </div>

                <div style={{ backgroundColor: '#27272a', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #3f3f46', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            id="is_recurring"
                            checked={isRecurring}
                            onChange={(e) => setIsRecurring(e.target.checked)}
                            style={{ width: '1.25rem', height: '1.25rem' }}
                        />
                        <label htmlFor="is_recurring" style={{ color: '#e4e4e7', fontSize: '1rem', fontWeight: 500 }}>Bu etkinlik her hafta aynı gün tekrarlansın</label>
                    </div>

                    {isRecurring && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1.75rem' }}>
                            <label style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>Kaç hafta boyunca eklensin?</label>
                            <select
                                value={recurrenceWeeks}
                                onChange={(e) => setRecurrenceWeeks(Number(e.target.value))}
                                style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#18181b', color: 'white', appearance: 'none', maxWidth: '200px' }}
                            >
                                <option value={2}>2 Hafta (Toplam 2 Etkinlik)</option>
                                <option value={4}>4 Hafta (Toplam 4 Etkinlik)</option>
                                <option value={8}>8 Hafta (Toplam 8 Etkinlik)</option>
                                <option value={12}>12 Hafta (Toplam 12 Etkinlik)</option>
                                <option value={24}>24 Hafta (Toplam 24 Etkinlik)</option>
                            </select>
                            <p style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '0.25rem' }}>
                                Sistem arka arkaya {recurrenceWeeks} adet etkinlik kaydı oluşturacaktır. İleride iptal olan haftaları etkinlik tablosundan tek tek silebilirsiniz.
                            </p>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Kapak Fotoğrafı URL (İsteğe Bağlı)</label>
                    <input name="cover_image" value={formData.cover_image} onChange={handleChange} placeholder="https://..." style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" id="is_free" name="is_free" checked={formData.is_free} onChange={handleChange} style={{ width: '1.25rem', height: '1.25rem' }} />
                    <label htmlFor="is_free" style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Bu etkinlik tamamen ücretsizdir</label>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Açıklama Detayları</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={4} style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white', resize: 'vertical' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={() => router.back()} style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: '#e4e4e7', border: '1px solid #3f3f46', borderRadius: '0.375rem', cursor: 'pointer' }}>İptal</button>
                    <button type="submit" disabled={loading} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 600 }}>
                        {loading ? 'Ekleniyor...' : (isRecurring ? `${recurrenceWeeks} Etkinlik Kaydet` : 'Etkinliği Kaydet')}
                    </button>
                </div>
            </form>
        </div>
    );
}
