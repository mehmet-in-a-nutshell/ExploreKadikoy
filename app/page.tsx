import styles from './page.module.css';
import EventCard from '../components/EventCard';
import VenueCard from '../components/VenueCard';
import GuideCard from '../components/GuideCard';
import SearchBar from '../components/SearchBar';
import Link from 'next/link';

import { supabase } from '../utils/supabase';
import { format } from 'date-fns';

export const revalidate = 10; // Refresh cache every 10 seconds

export default async function Home() {
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: rawEvents } = await supabase.from('events').select(`
        id, title, slug, date, time, is_free, cover_image, description, event_type, event_subtype,
        venues:venue_id (name)
  `).gte('date', today).order('created_at', { ascending: false }).limit(4);

  const featuredEvents = (rawEvents || []).map((e: any) => ({
    id: e.id,
    title: e.title,
    slug: e.slug,
    date: e.date,
    time: e.time,
    isFree: e.is_free,
    imageUrl: e.cover_image,
    venue: e.venues?.name || 'Kadıköy',
    eventType: e.event_type || 'Diğer',
    eventSubtype: e.event_subtype || ''
  }));

  const { data: rawVenues } = await supabase.from('venues').select('id, name, slug, neighborhood, description, cover_image, rating, venue_type').limit(3);
  const topVenues = (rawVenues || []).map((v: any) => ({
    id: v.id,
    name: v.name,
    neighborhood: v.neighborhood || 'Kadıköy',
    description: v.description || '',
    slug: v.slug,
    imageUrl: v.cover_image,
    rating: v.rating,
    venue_type: v.venue_type
  }));

  // Fetch top 2 guides
  const { data: rawGuides } = await supabase.from('guides').select('*').order('created_at', { ascending: false }).limit(2);
  const featuredGuides = (rawGuides || []).map((g: any) => ({
    id: g.id,
    title: g.title,
    excerpt: g.excerpt,
    readTime: g.read_time,
    slug: g.slug,
    imageUrl: g.cover_image
  }));

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          Kadıköy'de <span className="text-gradient">ne yapılır?</span>
        </h1>
        <p className={styles.subtitle}>Güncel etkinlikleri, mekanları ve şehrin ritmini keşfet.</p>
        <SearchBar />

        <div className={styles.quickFilters}>
          <Link href="/bugun" className={styles.quickFilterBtn}>🔥 Bugün</Link>
          <Link href="/ucretsiz-etkinlikler" className={styles.quickFilterBtn}>💸 Ücretsiz</Link>
          <Link href="/konserler" className={styles.quickFilterBtn}>🎸 Konser</Link>
          <Link href="/tiyatro" className={styles.quickFilterBtn}>🎭 Tiyatro</Link>
          <Link href="/workshop" className={styles.quickFilterBtn}>🎨 Workshop</Link>
          <Link href="/dans" className={styles.quickFilterBtn}>💃 Dans</Link>
          <Link href="/spor" className={styles.quickFilterBtn}>🏃 Spor</Link>
          <Link href="/oyun-gecesi" className={styles.quickFilterBtn}>🎲 Oyun gecesi</Link>
          <Link href="/tadim-etkinligi" className={styles.quickFilterBtn}>🍷 Tadım etkinliği</Link>
          <Link href="/bit-pazari" className={styles.quickFilterBtn}>🛍️ Bit pazarı</Link>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Bugün Öne Çıkanlar</h2>
          <Link href="/bugun" className={styles.viewAll}>Tümünü Gör &rarr;</Link>
        </div>
        <div className={styles.grid}>
          {featuredEvents.map(event => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Popüler Mekanlar</h2>
          <Link href="/mekanlar" className={styles.viewAll}>Tüm Mekanlar &rarr;</Link>
        </div>
        <div className={styles.grid}>
          {topVenues.map(venue => (
            <VenueCard key={venue.id} {...venue} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Semti Keşfet</h2>
          <Link href="/rehber" className={styles.viewAll}>Tüm Rehberler &rarr;</Link>
        </div>
        <div className={styles.gridTwoCols}>
          {featuredGuides.map(guide => (
            <GuideCard key={guide.id} {...guide} />
          ))}
        </div>
      </section>
    </main>
  );
}
