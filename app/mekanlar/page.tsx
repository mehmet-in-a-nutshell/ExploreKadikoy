import VenueCard from '../../components/VenueCard';
import styles from '../etkinlikler/page.module.css'; // Reusing identical layout structure

export const metadata = {
    title: 'Kadıköy Mekanları - ExploreKadikoy',
    description: 'Kadıköy\'deki kafeler, barlar, performans sahneleri ve kültür merkezleri.',
};

import { supabase } from '../../utils/supabase';

export const revalidate = 60; // Refresh cache every 60 seconds

export default async function MekanlarPage() {
    const { data: rawVenues } = await supabase.from('venues').select('id, name, slug, neighborhood, description, cover_image, rating, venue_type').order('created_at', { ascending: false });

    const venues = (rawVenues || []).map((v: any) => ({
        id: v.id,
        name: v.name,
        neighborhood: v.neighborhood || 'Kadıköy',
        description: v.description || '',
        slug: v.slug,
        imageUrl: v.cover_image,
        rating: v.rating,
        venue_type: v.venue_type
    }));

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Mekanlar</h1>
                    <p className={styles.subtitle}>Kahvecilerden konser salonlarına, Kadıköy'ün ruhunu yansıtan adresler.</p>
                </div>
            </header>

            <section className={styles.results}>
                <div className={styles.resultsInfo}>
                    <p><span>{venues.length} mekan</span> listeleniyor</p>
                </div>

                <div className={styles.grid}>
                    {venues.map((venue) => (
                        <VenueCard key={venue.id} {...venue} />
                    ))}
                </div>
            </section>
        </main>
    );
}
