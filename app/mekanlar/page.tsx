import VenueCard from '../../components/VenueCard';
import styles from '../etkinlikler/page.module.css'; // Reusing identical layout structure

export const metadata = {
    title: 'Kadıköy Mekanları - ExploreKadikoy',
    description: 'Kadıköy\'deki kafeler, barlar, performans sahneleri ve kültür merkezleri.',
};

export default function MekanlarPage() {
    const venues = [
        { id: 'v1', name: 'Müze Gazhane', neighborhood: 'Hasanpaşa', description: 'Tarihi havagazı fabrikasından dönüştürülen modern sanat, kültür ve yaşam alanı.', slug: 'muze-gazhane' },
        { id: 'v2', name: 'Süreyya Operası', neighborhood: 'Bahariye', description: 'Kadıköy\'ün ikonik klasik müzik ve sahne sanatları merkezi.', slug: 'sureyya-operasi' },
        { id: 'v3', name: 'Dorock XL', neighborhood: 'Kadikoy Merkez', description: 'Anadolu yakasının en popüler canlı performans ve rock müzik mekanı.', slug: 'dorock-xl' },
        { id: 'v4', name: 'Moda Sahnesi', neighborhood: 'Moda', description: 'Alternatif tiyatro oyunlarına ve bağımsız sinemaya ev sahipliği yapan kültür merkezi.', slug: 'moda-sahnesi' },
        { id: 'v5', name: 'Fahri Konsolos', neighborhood: 'Moda', description: 'İmza kokteylleri ve şık ambiyansıyla Kadıköy akşamlarının vazgeçilmezi.', slug: 'fahri-konsolos' },
    ];

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
