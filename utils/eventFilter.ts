export function filterDistinctEvents(events: any[]): any[] {
    if (!events || !Array.isArray(events)) return [];

    const uniqueEventsMap = new Map();

    for (const event of events) {
        // If the event title is already in the map, we skip adding it again
        // However, we mark the *already stored* first occurrence as recurring 
        // because we found a duplicate
        if (!uniqueEventsMap.has(event.title)) {
            // Default it to false initially, or relying on undefined is fine
            uniqueEventsMap.set(event.title, { ...event, isRecurring: false });
        } else {
            // It's a duplicate. Mark the first one as recurring
            const trackedEvent = uniqueEventsMap.get(event.title);
            trackedEvent.isRecurring = true;
        }
    }

    return Array.from(uniqueEventsMap.values());
}
