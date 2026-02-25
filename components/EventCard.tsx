import Link from 'next/link';
import styles from './EventCard.module.css';
import FavoriteButton from './FavoriteButton';

export interface EventCardProps {
    id: string;
    title: string;
    eventType?: string;
    eventSubtype?: string;
    venue: string;
    time: string;
    date: string;
    isFree?: boolean;
    imageUrl?: string;
    slug: string;
}

export default function EventCard({
    id,
    title,
    eventType,
    eventSubtype,
    venue,
    time,
    date,
    isFree = false,
    imageUrl,
    slug,
}: EventCardProps) {
    return (
        <div style={{ position: 'relative' }}>
            <Link href={`/etkinlikler/${slug}`} className={`${styles.card} glass`}>
                <div className={styles.imageHolder}>
                    {imageUrl ? (
                        <img src={imageUrl} alt={title} className={styles.image} loading="lazy" />
                    ) : (
                        <div className={styles.placeholderIcon}>🎟️</div>
                    )}
                    <div className={styles.badges}>
                        {eventType && (
                            <span className={styles.categoryBadge}>
                                {eventType}
                            </span>
                        )}
                        {isFree && <span className={styles.freeBadge}>Ücretsiz</span>}
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.header}>
                        <h3 className={styles.title}>{title}</h3>
                    </div>

                    <div className={styles.details}>
                        <div className={styles.detailItem}>
                            <span className={styles.icon}>📍</span>
                            <span>{venue}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.icon}>📅</span>
                            <span>{date} • {time}</span>
                        </div>
                    </div>
                </div>
            </Link>
            <FavoriteButton type="event" itemId={id} />
        </div>
    );
}
