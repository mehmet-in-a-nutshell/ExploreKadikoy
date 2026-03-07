import Link from 'next/link';
import Image from 'next/image';
import styles from './VenueCard.module.css';
import FavoriteButton from './FavoriteButton';

export interface VenueCardProps {
    id: string;
    name: string;
    neighborhood: string;
    description: string;
    imageUrl?: string;
    slug: string;
    rating?: number;
    venue_type?: string;
    compact?: boolean;
}

export default function VenueCard({
    id,
    name,
    neighborhood,
    description,
    imageUrl,
    slug,
    rating,
    venue_type,
    compact = false,
}: VenueCardProps) {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Link href={`/mekan/${slug}`} className={`${compact ? styles.cardCompact : styles.card} glass`}>
                <div className={compact ? styles.imageHolderCompact : styles.imageHolder}>
                    {imageUrl ? (
                        <Image src={imageUrl} alt={name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className={styles.image} />
                    ) : (
                        <div className={styles.placeholderIcon}>🏛️</div>
                    )}
                </div>

                <div className={compact ? styles.contentCompact : styles.content}>
                    <div className={styles.header}>
                        <span className={styles.neighborhoodBadge}>{neighborhood}</span>
                        <h3 className={styles.title} style={{ fontSize: compact ? '1.125rem' : '1.25rem' }}>{name}</h3>
                    </div>

                    {venue_type && (
                        <div style={{ fontSize: '0.875rem', color: '#c084fc', marginBottom: '0.5rem', fontWeight: 500 }}>
                            {venue_type}
                        </div>
                    )}

                    {!compact && <p className={styles.description}>{description}</p>}

                    {rating && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: 'auto', paddingTop: '0.5rem', color: '#fbbf24', fontSize: '0.875rem', fontWeight: 600 }}>
                            <span>⭐</span> {rating}
                        </div>
                    )}
                </div>
            </Link>
            <FavoriteButton type="venue" itemId={id} />
        </div>
    );
}
