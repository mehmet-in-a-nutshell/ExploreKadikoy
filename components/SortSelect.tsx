'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function SortSelect({ currentSort, className }: { currentSort: string, className?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        if (newSort === 'Yaklaşanlar' || newSort === 'Yakında') {
            params.delete('sort');
        } else {
            params.set('sort', newSort);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <select className={className} value={currentSort} onChange={handleChange}>
            <option value="Yaklaşanlar">Yaklaşanlar (Tarihe Göre)</option>
            <option value="Ücretsizler Önce">Ücretsizler Önce</option>
            <option value="A-Z">A-Z İsim Sıralaması</option>
        </select>
    );
}
