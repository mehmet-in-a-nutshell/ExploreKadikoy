import GuideCard from '../../components/GuideCard';
import styles from '../etkinlikler/page.module.css';
import { supabase } from '../../utils/supabase';

export const revalidate = 60; // Refresh cache every 60 seconds

export const metadata = {
    title: 'Kadıköy Keşif Rehberi - ExploreKadikoy',
    description: 'Kadıköy\'ü bir lokal gibi yaşayın. Rotalar, yeme-içme listeleri ve gizli noktalar.',
};

export default async function RehberPage() {
    // Fetch guides from Supabase
    const { data: rawGuides } = await supabase.from('guides').select('*').order('created_at', { ascending: false });

    // Format data for the component
    const guides = (rawGuides || []).map((guide: any) => ({
        id: guide.id,
        title: guide.title,
        slug: guide.slug,
        excerpt: guide.excerpt,
        readTime: guide.read_time,
        imageUrl: guide.cover_image,
    }));

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Rehber</h1>
                    <p className={styles.subtitle}>Şehri bizimle adım adım keşfedin.</p>
                </div>
            </header>

            <section className={styles.results}>
                <div className={styles.resultsInfo}>
                    <p><span>{guides.length} keşif rehberi</span> bulundu</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
                    {guides.map((guide) => (
                        <GuideCard key={guide.id} {...guide} />
                    ))}
                    {guides.length === 0 && (
                        <p style={{ color: 'var(--text-secondary)' }}>Henüz rehber eklenmemiş.</p>
                    )}
                </div>
            </section>
        </main>
    );
}
