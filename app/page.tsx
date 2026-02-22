import styles from './page.module.css';
import EventCard from '../components/EventCard';
import VenueCard from '../components/VenueCard';
import GuideCard from '../components/GuideCard';
import Link from 'next/link';

export default function Home() {
  const featuredEvents = [
    { id: '1', title: 'Kadıköy Sokak Sanatı Turu', category: 'Tur', venue: 'Moda Sahili', time: '14:00', date: 'Bugün', isFree: true, slug: 'kadikoy-sokak-sanati-turu' },
    { id: '2', title: 'Alternatif Rock Gecesi: Yüzyüzeyken Konuşuruz', category: 'Konser', venue: 'Dorock XL', time: '21:00', date: 'Bugün', isFree: false, slug: 'yuzyuzeyken-konusuruz-konseri' },
    { id: '3', title: 'Coffee Festival 2026', category: 'Festival', venue: 'Müze Gazhane', time: '10:00 - 18:00', date: 'Yarın', isFree: false, slug: 'coffee-festival-2026' },
    { id: '4', title: 'Açık Mikrofon Stand-up', category: 'Stand-up', venue: 'Karga Bar', time: '20:30', date: 'Cuma', isFree: true, slug: 'acik-mikrofon-karga' }
  ];

  const topVenues = [
    { id: 'v1', name: 'Müze Gazhane', neighborhood: 'Hasanpaşa', description: 'Tarihi havagazı fabrikasından dönüştürülen modern sanat, kültür ve yaşam alanı.', slug: 'muze-gazhane' },
    { id: 'v2', name: 'Süreyya Operası', neighborhood: 'Bahariye', description: 'Kadıköy\'ün ikonik klasik müzik ve sahne sanatları merkezi.', slug: 'sureyya-operasi' },
    { id: 'v3', name: 'Dorock XL', neighborhood: 'Kadikoy Merkez', description: 'Anadolu yakasının en popüler canlı performans ve rock müzik mekanı.', slug: 'dorock-xl' }
  ];

  const featuredGuides = [
    { id: 'g1', title: 'Kadıköy Kahve Rehberi: En İyi 10 Mekan', excerpt: 'Moda\'dan Yeldeğirmeni\'ne Kadıköy\'ün en iyi 3., nesil kahvecilerini sizin için derledik.', readTime: '5', slug: 'kadikoy-kahve-rehberi' },
    { id: 'g2', title: 'Yağmurlu Günde Kadıköy\'de Ne Yapılır?', excerpt: 'Havalar soğudu diye eve kapanmak yok! Kapalı mekanlarda keşfetmeniz gereken 7 harika aktivite.', readTime: '3', slug: 'yagmurlu-gunde-kadikoy' }
  ];

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          Kadıköy'de <span className="text-gradient">ne yapılır?</span>
        </h1>
        <p className={styles.subtitle}>Güncel etkinlikleri, mekanları ve şehrin ritmini keşfet.</p>
        <div className={styles.searchBar}>
          <input type="text" placeholder="Grup, mekan, etkinlik veya tarih ara..." className={styles.input} />
          <button className={styles.searchBtn}>Keşfet</button>
        </div>

        <div className={styles.quickFilters}>
          <Link href="/bugun" className={styles.quickFilterBtn}>🔥 Bugün</Link>
          <Link href="/ucretsiz-etkinlikler" className={styles.quickFilterBtn}>💸 Ücretsiz</Link>
          <Link href="/konserler" className={styles.quickFilterBtn}>🎸 Konser</Link>
          <Link href="/tiyatro" className={styles.quickFilterBtn}>🎭 Tiyatro</Link>
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
