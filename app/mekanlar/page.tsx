import VenueCard from '../../components/VenueCard';
import styles from '../etkinlikler/page.module.css'; // Reusing identical layout structure
import Link from 'next/link';

export const metadata = {
    title: 'Kadıköy Mekanları - ExploreKadikoy',
    description: 'Kadıköy\'deki kafeler, barlar, performans sahneleri ve kültür merkezleri.',
};

import { supabase } from '../../utils/supabase';
import { createClient } from '../../utils/supabase/server';

export const revalidate = 60; // Refresh cache every 60 seconds

const VENUE_TYPES = [
    "🍻 Yeme-İçme Mekanları",
    "🎭 Kültür & Sanat",
    "🎶 Etkinlik & Topluluk",
    "🛍️ Yaşam Tarzı",
    "🌿 Açık Alanlar",
    "🎓 Eğitim & Hobi",
    "🏋️ Spor & Aktivite"
];

export default async function MekanlarPage({
    searchParams,
}: {
    searchParams: Promise<{ type?: string }>
}) {
    const params = await searchParams;
    const activeType = params.type || null;

    const supabaseServer = await createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();

    let query = supabase.from('venues').select('id, name, slug, neighborhood, description, cover_image, rating, venue_type').order('created_at', { ascending: false });

    if (activeType) {
        query = query.eq('venue_type', activeType);
    }

    const { data: rawVenues } = await query;

    let likedVenueIds = new Set<string>();
    if (user) {
        const { data: likes } = await supabaseServer
            .from('user_favorite_venues')
            .select('venue_id')
            .eq('user_id', user.id);
        if (likes) {
            likes.forEach(like => likedVenueIds.add(like.venue_id));
        }
    }

    const venues = (rawVenues || []).map((v: any) => ({
        id: v.id,
        name: v.name,
        neighborhood: v.neighborhood || 'Kadıköy',
        description: v.description || '',
        slug: v.slug,
        imageUrl: v.cover_image,
        rating: v.rating,
        venue_type: v.venue_type,
        initialIsFavorite: likedVenueIds.has(v.id)
    }));

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Mekanlar</h1>
                    <p className={styles.subtitle}>Kahvecilerden konser salonlarına, Kadıköy'ün ruhunu yansıtan adresler.</p>
                </div>

                <div className={styles.filtersWrapper}>
                    <div className={styles.filtersScroll}>
                        <Link
                            href="/mekanlar"
                            className={`${styles.filterBtn} ${!activeType ? styles.active : ''}`}
                        >
                            Tümü
                        </Link>
                        {VENUE_TYPES.map((type) => (
                            <Link
                                key={type}
                                href={`/mekanlar?type=${encodeURIComponent(type)}`}
                                className={`${styles.filterBtn} ${activeType === type ? styles.active : ''}`}
                            >
                                {type}
                            </Link>
                        ))}
                    </div>
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
