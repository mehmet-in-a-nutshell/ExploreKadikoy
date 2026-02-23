import EventCard from '../../components/EventCard';
import styles from '../etkinlikler/page.module.css';

export const metadata = {
    title: 'Kadıköy Tiyatro Oyunları - ExploreKadikoy',
    description: 'Moda Sahnesi, Baba Sahne, Oyun Atölyesi ve daha fazlasındaki güncel tiyatro oyunları.',
};

import { supabase } from '../../utils/supabase';

export const revalidate = 60; // Refresh cache every 60 seconds

export default async function TiyatroPage() {
    const { data: rawEvents } = await supabase.from('events').select(`
        id, title, slug, date, time, is_free, cover_image, description,
        venues:venue_id (name),
        categories:category_id (name)
    `).order('created_at', { ascending: false });

    const events = (rawEvents || [])
        .filter((e: any) => e.categories?.slug === 'tiyatro' || e.categories?.name === 'Tiyatro')
        .map((e: any) => ({
            id: e.id,
            title: e.title,
            slug: e.slug,
            date: e.date,
            time: e.time,
            isFree: e.is_free,
            imageUrl: e.cover_image,
            venue: e.venues?.name || 'Kadıköy',
            category: e.categories?.name || 'Tiyatro'
        }));

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Tiyatro</h1>
                    <p className={styles.subtitle}>Kadıköy sahnelerindeki en güncel oyunlar.</p>
                </div>
            </header>

            <section className={styles.results}>
                <div className={styles.resultsInfo}>
                    <p><span>{events.length} tiyatro oyunu</span> bulundu</p>
                </div>

                <div className={styles.grid}>
                    {events.map((evt) => (
                        <EventCard key={evt.id} {...evt} />
                    ))}
                </div>
            </section>
        </main>
    );
}
