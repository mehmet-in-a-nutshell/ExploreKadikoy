'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
    type: 'event' | 'venue';
    itemId: string;
    initialIsFavorite?: boolean;
    variant?: 'floating' | 'inline';
}

export default function FavoriteButton({ type, itemId, initialIsFavorite, variant = 'floating' }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite || false);
    const [loading, setLoading] = useState(initialIsFavorite === undefined);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const supabase = createClient();

    const tableName = type === 'event' ? 'user_favorite_events' : 'user_favorite_venues';
    const columnIdName = type === 'event' ? 'event_id' : 'venue_id';

    useEffect(() => {
        if (initialIsFavorite !== undefined) return; // Skip fetch if provided server-side

        async function checkFavoriteStatus() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data } = await supabase
                    .from(tableName)
                    .select('*')
                    .eq('user_id', user.id)
                    .eq(columnIdName, itemId)
                    .single();

                if (data) {
                    setIsFavorite(true);
                }
            }
            setLoading(false);
        }

        checkFavoriteStatus();
    }, [itemId, tableName, columnIdName, supabase, initialIsFavorite]);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating if this button is inside a Link card

        const { data: { user: currentUser } } = await supabase.auth.getUser();

        if (!currentUser) {
            alert('Favorilere eklemek için giriş yapmalısınız.');
            router.push('/login');
            return;
        }

        const prevStatus = isFavorite;
        setIsFavorite(!isFavorite); // Optimistic UI update

        try {
            if (prevStatus) {
                // Remove favorite
                await supabase
                    .from(tableName)
                    .delete()
                    .eq('user_id', currentUser.id)
                    .eq(columnIdName, itemId);
            } else {
                // Add favorite
                await supabase
                    .from(tableName)
                    .insert([{ user_id: currentUser.id, [columnIdName]: itemId }]);
            }
        } catch (error) {
            console.error('Favorite toggle error:', error);
            setIsFavorite(prevStatus); // Revert on failure
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    if (loading) {
        return <div style={{ width: '32px', height: '32px' }} />; // placeholder
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
