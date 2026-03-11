import styles from './page.module.css';
import EventCard from '../components/EventCard';
import VenueCard from '../components/VenueCard';
import GuideCard from '../components/GuideCard';
import SearchBar from '../components/SearchBar';
import Link from 'next/link';

import { supabase } from '../utils/supabase';
import { createClient } from '../utils/supabase/server';
import { format } from 'date-fns';
import { filterDistinctEvents } from '../utils/eventFilter';

export const revalidate = 60; // Refresh cache every 60 seconds

export default async function Home() {
  const today = format(new Date(), 'yyyy-MM-dd');

  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  const [eventsResult, venuesResult, guidesResult] = await Promise.all([
    supabase.from('events').select(`
            id, title, slug, date, time, is_free, cover_image, description, event_type, event_subtype,
            venues:venue_id (name)
      `).gte('date', today).order('date', { ascending: true }).limit(20),

    supabase.from('venues').select('id, name, slug, neighborhood, description, cover_image, rating, venue_type').limit(3),

    supabase.from('guides').select('*').order('created_at', { ascending: false }).limit(2)
  ]);

  const rawEvents = eventsResult.data;
  const rawVenues = venuesResult.data;
  const rawGuides = guidesResult.data;

  const distinctRawEvents = filterDistinctEvents(rawEvents || []);

  let likedEventIds = new Set<string>();
  let likedVenueIds = new Set<string>();

  if (user) {
    const [eventsLikesResult, venuesLikesResult] = await Promise.all([
      supabaseServer.from('user_favorite_events').select('event_id').eq('user_id', user.id),
      supabaseServer.from('user_favorite_venues').select('venue_id').eq('user_id', user.id)
    ]);

    if (eventsLikesResult.data) eventsLikesResult.data.forEach(like => likedEventIds.add(like.event_id));
    if (venuesLikesResult.data) venuesLikesResult.data.forEach(like => likedVenueIds.add(like.venue_id));
  }

  const featuredEvents = distinctRawEvents.slice(0, 6).map((e: any) => ({
    id: e.id,
    title: e.title,
    slug: e.slug,
    date: e.date,
    time: e.time,
    isFree: e.is_free,
    isRecurring: e.isRecurring,
    imageUrl: e.cover_image,
    venue: e.venues?.name || 'Kadıköy',
    eventType: e.event_type || 'Genel',
    eventSubtype: e.event_subtype || '',
    initialIsFavorite: likedEventIds.has(e.id)
  }));

  const topVenues = (rawVenues || []).map((v: any) => ({
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
          <Link href="/stand-up" className={styles.quickFilterBtn}>🎤 Stand-up</Link>
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
