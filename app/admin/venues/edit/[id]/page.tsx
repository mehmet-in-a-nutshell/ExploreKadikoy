'use client';

import { useState, useEffect, use } from 'react';
import { createClient } from '../../../../../utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function EditVenuePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const supabase = createClient();

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        neighborhood: '',
        description: '',
        cover_image: '',
        rating: '',
        google_maps_url: '',
        venue_type: ''
    });

    useEffect(() => {
        async function fetchData() {
            const { data: venueData } = await supabase.from('venues').select('*').eq('id', id).single();
            if (venueData) {
                setFormData({
                    name: venueData.name || '',
                    slug: venueData.slug || '',
                    neighborhood: venueData.neighborhood || '',
                    description: venueData.description || '',
                    cover_image: venueData.cover_image || '',
                    rating: venueData.rating || '',
                    google_maps_url: venueData.google_maps_url || '',
                    venue_type: venueData.venue_type || ''
                });
            }
            setLoading(false);
        }
        fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase.from('venues').update(formData).eq('id', id);
            if (error) throw error;
            alert('Mekan başarıyla güncellendi!');
            router.push('/admin/venues');
            router.refresh();
        } catch (error: any) {
            alert('Hata: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Yükleniyor...</div>;

    return (
        <div style={{ maxWidth: '800px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '2rem' }}>Mekanı Düzenle</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#18181b', padding: '2rem', borderRadius: '0.5rem', border: '1px solid #27272a' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Mekan Adı *</label>
                        <input required name="name" value={formData.name} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>URL (Slug) *</label>
                        <input required name="slug" value={formData.slug} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Mekan Tipi *</label>
                    <select required name="venue_type" value={formData.venue_type} onChange={handleChange as any} style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white', appearance: 'none' }}>
                        <option value="" disabled>Mekan tipi seçin</option>
                        <option value="🍻 Yeme-İçme Mekanları">🍻 Yeme-İçme Mekanları</option>
                        <option value="🎭 Kültür & Sanat">🎭 Kültür & Sanat</option>
                        <option value="🎶 Etkinlik & Topluluk">🎶 Etkinlik & Topluluk</option>
                        <option value="🛍️ Yaşam Tarzı">🛍️ Yaşam Tarzı</option>
                        <option value="🌿 Açık Alanlar">🌿 Açık Alanlar</option>
                        <option value="🎓 Eğitim & Hobi">🎓 Eğitim & Hobi</option>
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Semt/Mahalle (Örn: Moda, Yeldeğirmeni)</label>
                        <input name="neighborhood" value={formData.neighborhood} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Kapak Fotoğrafı URL (İsteğe Bağlı)</label>
                        <input name="cover_image" value={formData.cover_image} onChange={handleChange} placeholder="https://..." style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Değerlendirme Puanı (1.0 - 5.0)</label>
                        <input name="rating" type="number" min="1" max="5" step="0.1" value={formData.rating} onChange={handleChange} placeholder="Örn: 4.5" style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Google Maps Yerleştirme Kodu (İsteğe Bağlı)</label>
                        <input name="google_maps_url" value={formData.google_maps_url} onChange={handleChange} placeholder='<iframe src="https://www.google.com/maps/embed?..." ></iframe>' style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Açıklama Detayları</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={4} style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white', resize: 'vertical' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={() => router.back()} style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: '#e4e4e7', border: '1px solid #3f3f46', borderRadius: '0.375rem', cursor: 'pointer' }}>İptal</button>
                    <button type="submit" disabled={saving} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 600 }}>
                        {saving ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
}
