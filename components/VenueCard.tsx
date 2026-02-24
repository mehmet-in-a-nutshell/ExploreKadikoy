import Link from 'next/link';
import styles from './VenueCard.module.css';

export interface VenueCardProps {
    id: string;
    name: string;
    neighborhood: string;
    description: string;
    imageUrl?: string;
    slug: string;
    rating?: number;
}

export default function VenueCard({
    id,
    name,
    neighborhood,
    description,
    imageUrl,
    slug,
    rating,
}: VenueCardProps) {
    return (
        <Link href={`/mekan/${slug}`} className={`${styles.card} glass`}>
            <div className={styles.imageHolder}>
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className={styles.image} loading="lazy" />
                ) : (
                    <div className={styles.placeholderIcon}>🏛️</div>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <span className={styles.neighborhoodBadge}>{neighborhood}</span>
                    <h3 className={styles.title}>{name}</h3>
                </div>

                <p className={styles.description}>{description}</p>

                {rating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: 'auto', paddingTop: '0.5rem', color: '#fbbf24', fontSize: '0.875rem', fontWeight: 600 }}>
                        <span>⭐</span> {rating}
                    </div>
                )}
            </div>
        </Link>
    );
}
