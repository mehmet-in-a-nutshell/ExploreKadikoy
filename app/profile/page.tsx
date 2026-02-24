import { createClient } from '../../utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <main style={{ minHeight: '100vh', padding: '6rem 2rem 2rem 2rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '2.5rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Profilim</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Hoş geldiniz, sekreteri olduğunuz favori etkinlikleriniz burada yer alacaktır.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '0.75rem' }}>
                    <div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>E-posta Adresiniz:</span>
                        <p style={{ fontWeight: 500 }}>{user.email}</p>
                    </div>
                    <div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Üyelik Tarihi:</span>
                        <p style={{ fontWeight: 500 }}>{new Date(user.created_at).toLocaleDateString('tr-TR')}</p>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <form action="/auth/logout" method="post">
                        <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
                            Çıkış Yap
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
