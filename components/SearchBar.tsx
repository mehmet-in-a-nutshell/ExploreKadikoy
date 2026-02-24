'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../app/page.module.css';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        const trimmed = query.trim();
        if (!trimmed) {
            router.push('/bugun');
        } else {
            router.push(`/arama?q=${encodeURIComponent(trimmed)}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className={styles.searchBar}>
            <input
                type="text"
                placeholder="Grup, mekan, etkinlik veya tarih ara..."
                className={styles.input}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button className={styles.searchBtn} onClick={handleSearch}>Keşfet</button>
        </div>
    );
}
