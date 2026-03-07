const fs = require('fs');

const filesToPatcher = [
    { path: 'app/ucretsiz-etkinlikler/page.tsx' },
    { path: 'app/tiyatro/page.tsx' },
    { path: 'app/workshop/page.tsx' },
    { path: 'app/dans/page.tsx' },
    { path: 'app/spor/page.tsx' },
    { path: 'app/oyun-gecesi/page.tsx' },
    { path: 'app/tadim-etkinligi/page.tsx' },
    { path: 'app/bit-pazari/page.tsx' },
    { path: 'app/sergiler/page.tsx' },
    { path: 'app/yoga/page.tsx' },
    { path: 'app/konserler/page.tsx' }
];

for (let item of filesToPatcher) {
    if (!fs.existsSync(item.path)) continue;
    let content = fs.readFileSync(item.path, 'utf8');

    // 1. Remove premature distinctEvents block
    if (content.includes('const distinctEvents = filterDistinctEvents(rawEvents || []);\n\n    const allCategoryEvents = distinctEvents')) {
        content = content.replace(
            'const distinctEvents = filterDistinctEvents(rawEvents || []);\n\n    const allCategoryEvents = distinctEvents',
            'const allCategoryEvents = (rawEvents || [])'
        );
    }

    // Replace `filterDistinctEvents(rawEvents || null)` or similar just in case
    content = content.replace(/const distinctEvents = filterDistinctEvents\(rawEvents \|\| \[\]\);/g, '');
    content = content.replace(/const allCategoryEvents = distinctEvents/g, 'const allCategoryEvents = (rawEvents || [])');

    // 2. Wrap the final splits with filterDistinctEvents
    // From: const events = allCategoryEvents.filter((e: any) => e.date >= today);
    // To: const events = filterDistinctEvents(allCategoryEvents.filter((e: any) => e.date >= today));

    // Make sure we don't double wrap
    if (!content.includes('filterDistinctEvents(allCategoryEvents.filter((e: any) => e.date >= today))')) {
        content = content.replace(
            /const events = allCategoryEvents\.filter\(\(e: any\) => e\.date >= today\);/,
            'const events = filterDistinctEvents(allCategoryEvents.filter((e: any) => e.date >= today));'
        );
    }

    if (!content.includes('filterDistinctEvents(allCategoryEvents.filter((e: any) => e.date < today))')) {
        content = content.replace(
            /const pastEvents = allCategoryEvents\.filter\(\(e: any\) => e\.date < today\)/,
            'const pastEvents = filterDistinctEvents(allCategoryEvents.filter((e: any) => e.date < today))'
        );
    }

    fs.writeFileSync(item.path, content);
    console.log("Fixed:", item.path);
}
