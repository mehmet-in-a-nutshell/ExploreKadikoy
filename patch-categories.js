const fs = require('fs');

const filesToPatcher = [
    { path: 'app/ucretsiz-etkinlikler/page.tsx', label: 'ücretsiz etkinlik' },
    { path: 'app/tiyatro/page.tsx', label: 'tiyatro oyunu' },
    { path: 'app/workshop/page.tsx', label: 'atölye' },
    { path: 'app/dans/page.tsx', label: 'dans etkinliği' },
    { path: 'app/spor/page.tsx', label: 'spor etkinliği' },
    { path: 'app/oyun-gecesi/page.tsx', label: 'oyun gecesi' },
    { path: 'app/tadim-etkinligi/page.tsx', label: 'tadım etkinliği' },
    { path: 'app/bit-pazari/page.tsx', label: 'bit pazarı' },
    { path: 'app/sergiler/page.tsx', label: 'sergi' },
    { path: 'app/yoga/page.tsx', label: 'yoga etkinliği' }
];

for (let item of filesToPatcher) {
    if (!fs.existsSync(item.path)) {
        console.log("Missing:", item.path);
        continue;
    }
    let content = fs.readFileSync(item.path, 'utf8');

    // Add date-fns import if not exists
    if (!content.includes('import { format, subMonths }')) {
        if (content.includes("import { filterDistinctEvents } from '../../utils/eventFilter';")) {
            content = content.replace(
                "import { filterDistinctEvents } from '../../utils/eventFilter';",
                "import { filterDistinctEvents } from '../../utils/eventFilter';\nimport { format, subMonths } from 'date-fns';"
            );
        } else {
            // e.g. sergiler or ucretsiz without distinct filter?
            content = content.replace(
                "import { supabase } from '../../utils/supabase';",
                "import { supabase } from '../../utils/supabase';\nimport { format, subMonths } from 'date-fns';"
            );
        }
    }

    // Setup the date variables right inside the component function
    if (!content.includes('const today = format(new Date()')) {
        content = content.replace(
            /(export default async function \w+\(\) \{\n)/,
            '$1    const today = format(new Date(), \'yyyy-MM-dd\');\n    const oneMonthAgo = format(subMonths(new Date(), 1), \'yyyy-MM-dd\');\n'
        );
    }

    // Modify the supabase fetch to include the 1-month-ago limit (avoid touching time logic)
    if (!content.includes("gte('date', oneMonthAgo)")) {
        content = content.replace(
            /\.order\('date'/g,
            ".gte('date', oneMonthAgo).order('date'"
        );
        content = content.replace(
            /\.order\('created_at'/g,
            ".gte('date', oneMonthAgo).order('created_at'"
        );
    }

    // Split into events and pastEvents
    if (!content.includes("const allCategoryEvents = ")) {
        content = content.replace(/const events = /g, 'const allCategoryEvents = ');

        const splitLogic = `
    const events = allCategoryEvents.filter((e: any) => e.date >= today);
    const pastEvents = allCategoryEvents.filter((e: any) => e.date < today).sort((a: any, b: any) => b.date.localeCompare(a.date));
`;
        content = content.replace(/    return \(/, splitLogic + '\n    return (');
    }

    // Inject the final JSX block
    if (!content.includes('Tamamlanan Etkinlikler')) {
        const jsx = `
            {pastEvents.length > 0 && (
                <section className={styles.results} style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
                    <div className={styles.headerContent}>
                        <h2 className={styles.title} style={{ fontSize: '2rem' }}>Tamamlanan Etkinlikler</h2>
                        <p className={styles.subtitle}>Son 1 ay içinde gerçekleşen etkinlikler.</p>
                    </div>

                    <div className={styles.resultsInfo} style={{ marginTop: '1.5rem' }}>
                        <p><span>{pastEvents.length} ${item.label}</span> bulundu</p>
                    </div>

                    <div className={styles.grid}>
                        {pastEvents.map((evt: any) => (
                            <EventCard key={evt.id} {...evt} />
                        ))}
                    </div>
                </section>
            )}
        </main>`;

        content = content.replace(/        <\/main>/, jsx);
    }

    // Fix the mapping mapping reference if any error exists: {events.map((evt) => (
    // Instead of `events.map((evt)`, strictly make sure it is `events.map((evt: any) => (`
    content = content.replace(/\{events\.map\(\(evt\) => \(/g, '{events.map((evt: any) => (');

    fs.writeFileSync(item.path, content);
    console.log("Patched:", item.path);
}
