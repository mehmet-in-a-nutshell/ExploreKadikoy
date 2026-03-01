import { MetadataRoute } from 'next';
import { createClient } from '../utils/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient();
    const baseUrl = 'https://explorekadikoy.com';

    // Fetch dynamic content
    const [eventsResult, venuesResult, guidesResult] = await Promise.all([
        supabase.from('events').select('slug, date').order('date', { ascending: false }),
        supabase.from('venues').select('slug, id'),
        supabase.from('guides').select('slug, created_at').order('created_at', { ascending: false })
    ]);

    const events = eventsResult.data || [];
    const venues = venuesResult.data || [];
    const guides = guidesResult.data || [];

    // Map dynamic routes
    const eventUrls = events.map((event) => ({
        url: `${baseUrl}/etkinlikler/${event.slug}`,
        lastModified: new Date(event.date || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const venueUrls = venues.map((venue) => ({
        url: `${baseUrl}/mekan/${venue.slug || venue.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    const guideUrls = guides.map((guide) => ({
        url: `${baseUrl}/rehber/${guide.slug}`,
        lastModified: new Date(guide.created_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // Define static routes
    const staticPages = [
        '',
        '/etkinlikler',
        '/bugun',
        '/bu-hafta',
        '/ucretsiz-etkinlikler',
        '/rehber',
        '/mekanlar',
        '/hakkimizda',
        '/iletisim',
        '/sss',
        '/konserler',
        '/tiyatro',
        '/sergiler',
        '/workshop',
        '/spor',
        '/oyun-gecesi',
        '/quiz-night',
        '/yoga',
        '/dans',
        '/tadim-etkinligi',
        '/bit-pazari'
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    return [...staticPages, ...eventUrls, ...venueUrls, ...guideUrls];
}
