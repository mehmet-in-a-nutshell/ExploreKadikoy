'use client';

import { useState } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminDeleteButton({ id, table, title }: { id: string | number, table: string, title?: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleDelete = async () => {
        if (!window.confirm(`"${title || 'Bu öğeyi'}" kalıcı olarak silmek istediğinize emin misiniz?`)) return;

        setLoading(true);
        try {
            const { error } = await supabase.from(table).delete().eq('id', id);

            if (error) throw error;

            router.refresh();
        } catch (error: any) {
            alert('Silme işlemi başarısız: ' + error.message);
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            style={{
                background: 'none',
                border: 'none',
                color: loading ? '#ef444480' : '#f87171',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem'
            }}
        >
            {loading ? 'Siliniyor...' : 'Sil'}
        </button>
    );
}
