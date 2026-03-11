'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '../utils/supabase/client';

interface FavoritesContextType {
    eventFavorites: Set<string>;
    venueFavorites: Set<string>;
    isLoading: boolean;
    toggleEventFavorite: (id: string, user: any) => Promise<boolean>;
    toggleVenueFavorite: (id: string, user: any) => Promise<boolean>;
    user: any;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [eventFavorites, setEventFavorites] = useState<Set<string>>(new Set());
    const [venueFavorites, setVenueFavorites] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        let isMounted = true;

        async function fetchFavorites() {
            try {
                const { data: { user: currentUser } } = await supabase.auth.getUser();

                if (currentUser && isMounted) {
                    setUser(currentUser);

                    // Fetch both favorites in parallel
                    const [eventsRes, venuesRes] = await Promise.all([
                        supabase.from('user_favorite_events').select('event_id').eq('user_id', currentUser.id),
                        supabase.from('user_favorite_venues').select('venue_id').eq('user_id', currentUser.id)
                    ]);

                    if (isMounted) {
                        const newEventFavorites = new Set<string>();
                        const newVenueFavorites = new Set<string>();

                        if (eventsRes.data) eventsRes.data.forEach(item => newEventFavorites.add(item.event_id));
                        if (venuesRes.data) venuesRes.data.forEach(item => newVenueFavorites.add(item.venue_id));

                        setEventFavorites(newEventFavorites);
                        setVenueFavorites(newVenueFavorites);
                    }
                }
            } catch (error) {
                console.error('Error fetching global favorites:', error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchFavorites();

        return () => {
            isMounted = false;
        };
    }, []);

    const toggleEventFavorite = async (id: string, currentUser: any): Promise<boolean> => {
        if (!currentUser) return false;

        const isCurrentlyFavorite = eventFavorites.has(id);
        const newSet = new Set(eventFavorites);

        // Optimistic UI update
        if (isCurrentlyFavorite) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setEventFavorites(newSet);

        try {
            if (isCurrentlyFavorite) {
                await supabase.from('user_favorite_events').delete().eq('user_id', currentUser.id).eq('event_id', id);
            } else {
                await supabase.from('user_favorite_events').insert([{ user_id: currentUser.id, event_id: id }]);
            }
            return true;
        } catch (error) {
            console.error('Error toggling event favorite:', error);
            // Revert on failure
            setEventFavorites(eventFavorites);
            return false;
        }
    };

    const toggleVenueFavorite = async (id: string, currentUser: any): Promise<boolean> => {
        if (!currentUser) return false;

        const isCurrentlyFavorite = venueFavorites.has(id);
        const newSet = new Set(venueFavorites);

        // Optimistic UI update
        if (isCurrentlyFavorite) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setVenueFavorites(newSet);

        try {
            if (isCurrentlyFavorite) {
                await supabase.from('user_favorite_venues').delete().eq('user_id', currentUser.id).eq('venue_id', id);
            } else {
                await supabase.from('user_favorite_venues').insert([{ user_id: currentUser.id, venue_id: id }]);
            }
            return true;
        } catch (error) {
            console.error('Error toggling venue favorite:', error);
            // Revert on failure
            setVenueFavorites(venueFavorites);
            return false;
        }
    };

    return (
        <FavoritesContext.Provider value={{ eventFavorites, venueFavorites, isLoading, toggleEventFavorite, toggleVenueFavorite, user }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}
