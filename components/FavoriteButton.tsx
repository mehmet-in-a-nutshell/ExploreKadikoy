'use client';

import { useRouter } from 'next/navigation';
import { useFavorites } from '../contexts/FavoritesContext';

interface FavoriteButtonProps {
    type: 'event' | 'venue';
    itemId: string;
    initialIsFavorite?: boolean;
    variant?: 'floating' | 'inline';
}

export default function FavoriteButton({ type, itemId, variant = 'floating' }: FavoriteButtonProps) {
    const { eventFavorites, venueFavorites, toggleEventFavorite, toggleVenueFavorite, isLoading, user } = useFavorites();
    const router = useRouter();

    const isFavorite = type === 'event' ? eventFavorites.has(itemId) : venueFavorites.has(itemId);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating if this button is inside a Link card

        if (!user) {
            alert('Favorilere eklemek için giriş yapmalısınız.');
            router.push('/login');
            return;
        }

        if (type === 'event') {
            await toggleEventFavorite(itemId, user);
        } else {
            await toggleVenueFavorite(itemId, user);
        }
    };

    if (isLoading && !user) {
        return <div style={{ width: '32px', height: '32px', opacity: 0 }} />; // placeholder while checking auth
    }

    if (variant === 'inline') {
        return (
            <button
                onClick={toggleFavorite}
                aria-label={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                style={{
                    width: '100%',
                    backgroundColor: isFavorite ? 'rgba(236, 72, 153, 0.15)' : '#18181b',
                    color: isFavorite ? '#ec4899' : '#a1a1aa',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: isFavorite ? '1px solid rgba(236, 72, 153, 0.5)' : '1px solid rgba(236, 72, 153, 0.2)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                    marginTop: '1rem'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = isFavorite ? 'rgba(236, 72, 153, 0.25)' : '#27272a';
                    e.currentTarget.style.color = isFavorite ? '#f472b6' : 'white';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = isFavorite ? 'rgba(236, 72, 153, 0.15)' : '#18181b';
                    e.currentTarget.style.color = isFavorite ? '#ec4899' : '#a1a1aa';
                }}
            >
                {isFavorite ? '❤️ Favorilerimde' : '🤍 Favorilere Ekle'}
            </button>
        );
    }

    return (
        <button
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
            style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: isFavorite ? 'rgba(236, 72, 153, 0.15)' : 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(4px)',
                border: isFavorite ? '1px solid rgba(236, 72, 153, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                zIndex: 10,
                color: isFavorite ? '#ec4899' : 'white',
                fontSize: '1.25rem'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                if (!isFavorite) e.currentTarget.style.color = '#ec4899';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                if (!isFavorite) e.currentTarget.style.color = 'white';
            }}
        >
            {isFavorite ? '❤️' : '🤍'}
        </button>
    );
}
