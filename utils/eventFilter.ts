export function filterDistinctEvents(events: any[]): any[] {
    if (!events || !Array.isArray(events)) return [];

    const uniqueEventsMap = new Map();

    for (const event of events) {
        // If the event title is already in the map, we skip it
        // Since we usually order by date ASC in category pages,
        // the first one encountered is the earliest. 
        if (!uniqueEventsMap.has(event.title)) {
            uniqueEventsMap.set(event.title, event);
        }
    }

    return Array.from(uniqueEventsMap.values());
}
