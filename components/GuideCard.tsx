import Link from 'next/link';
import Image from 'next/image';
import styles from './GuideCard.module.css';

export interface GuideCardProps {
    id: string;
    title: string;
    excerpt: string;
    readTime: string;
    imageUrl?: string;
    slug: string;
}

export default function GuideCard({
    id,
    title,
    excerpt,
    readTime,
    imageUrl,
    slug,
}: GuideCardProps) {
    return (
        <Link href={`/rehber/${slug}`} className={styles.card}>
            <div className={styles.imageHolder}>
                {imageUrl ? (
                    <Image src={imageUrl} alt={title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className={styles.image} />
                ) : (
                    <div className={styles.placeholderIcon}>📖</div>
                )}
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.excerpt}>{excerpt}</p>
                <div className={styles.footer}>
                    <span className={styles.readTime}>⏱️ {readTime} dk okuma</span>
                    <span className={styles.readMore}>Hemen Oku &rarr;</span>
                </div>
            </div>
        </Link>
    );
}
