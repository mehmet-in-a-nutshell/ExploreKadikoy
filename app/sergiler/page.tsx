import EventCard from '../../components/EventCard';
import styles from '../etkinlikler/page.module.css';

export const metadata = {
    title: 'Kadıköy Sergileri - ExploreKadikoy',
    description: 'Kadıköy\'deki güncel resim, heykel ve dijital sanat sergilerini keşfedin.',
};

import { supabase } from '../../utils/supabase';

export const revalidate = 60; // Refresh cache every 60 seconds

export default async function SergilerPage() {
    const { data: rawEvents } = await supabase.from('events').select(`
        id, title, slug, date, time, is_free, cover_image, description,
        venues:venue_id (name),
        categories:category_id (name, slug)
    `).order('created_at', { ascending: false });

    const events = (rawEvents || [])
        .filter((e: any) => e.categories?.slug === 'sergi' || e.categories?.name === 'Sergi')
        .map((e: any) => ({
            id: e.id,
            title: e.title,
            slug: e.slug,
            date: e.date,
            time: e.time,
            isFree: e.is_free,
            imageUrl: e.cover_image,
            venue: e.venues?.name || 'Kadıköy',
            category: e.categories?.name || 'Sergi'
        }));

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Sergiler</h1>
                    <p className={styles.subtitle}>En ilham verici sanat eserleri ve modern sergileri keşfedin.</p>
                </div>
            </header>

            <section className={styles.results}>
                <div className={styles.resultsInfo}>
                    <p><span>{events.length} sergi</span> bulundu</p>
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
