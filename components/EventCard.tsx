import Link from 'next/link';
import styles from './EventCard.module.css';

export interface EventCardProps {
    id: string;
    title: string;
    category: string;
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
    category,
    venue,
    time,
    date,
    isFree = false,
    imageUrl,
    slug,
}: EventCardProps) {
    return (
        <Link href={`/etkinlikler/${slug}`} className={`${styles.card} glass`}>
            <div className={styles.imageHolder}>
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className={styles.image} loading="lazy" />
                ) : (
                    <div className={styles.placeholderIcon}>🎟️</div>
                )}
                <div className={styles.badges}>
                    <span className={styles.categoryBadge}>{category}</span>
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
    );
}
