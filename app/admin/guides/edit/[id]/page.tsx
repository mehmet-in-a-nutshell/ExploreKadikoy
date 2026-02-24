'use client';

import { useState, useEffect, use } from 'react';
import { createClient } from '../../../../../utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function EditGuidePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const supabase = createClient();

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        read_time: '',
        cover_image: '',
        content: ''
    });

    useEffect(() => {
        async function fetchData() {
            const { data: guideData } = await supabase.from('guides').select('*').eq('id', id).single();
            if (guideData) {
                setFormData({
                    title: guideData.title || '',
                    slug: guideData.slug || '',
                    excerpt: guideData.excerpt || '',
                    read_time: guideData.read_time || '',
                    cover_image: guideData.cover_image || '',
                    content: guideData.content || ''
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
            const { error } = await supabase.from('guides').update(formData).eq('id', id);
            if (error) throw error;
            alert('Rehber başarıyla güncellendi!');
            router.push('/admin/guides');
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
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '2rem' }}>Rehberi Düzenle</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#18181b', padding: '2rem', borderRadius: '0.5rem', border: '1px solid #27272a' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Rehber Başlığı *</label>
                        <input required name="title" value={formData.title} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>URL (Slug) *</label>
                        <input required name="slug" value={formData.slug} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Okuma Süresi (Dk) *</label>
                        <input required name="read_time" type="number" min="1" value={formData.read_time} onChange={handleChange} placeholder="Örn: 5" style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Kapak Fotoğrafı URL (İsteğe Bağlı)</label>
                        <input name="cover_image" value={formData.cover_image} onChange={handleChange} placeholder="https://..." style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Kısa Açıklama (Özet) *</label>
                    <textarea required name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white', resize: 'vertical' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: '#e4e4e7', fontSize: '0.875rem' }}>Rehber İçeriği</label>
                    <textarea name="content" value={formData.content} onChange={handleChange} rows={8} style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white', resize: 'vertical' }} />
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
