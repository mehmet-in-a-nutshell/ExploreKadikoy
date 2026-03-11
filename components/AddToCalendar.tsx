'use client';

import React, { useState } from 'react';

interface AddToCalendarProps {
    event: {
        title: string;
        date: string; // YYYY-MM-DD
        time?: string; // HH:MM
        venueName?: string;
        slug: string;
    }
}

export default function AddToCalendar({ event }: AddToCalendarProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Default to 12:00 if no time is specified
    const timeStr = event.time && event.time.includes(':') ? event.time : '12:00';

    // Parse date and time representing Turkey's local time (UTC+03:00)
    // We treat the ISO string suffix +03:00 to convert correctly.
    const isoString = `${event.date}T${timeStr}:00+03:00`;
    let startDate: Date;
    try {
        startDate = new Date(isoString);
        if (isNaN(startDate.getTime())) throw new Error('Invalid Date');
    } catch {
        startDate = new Date(); // fallback
    }

    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // add 2 hours

    // format as YYYYMMDDTHHmmssZ (UTC)
    const formatICSDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startFormatted = formatICSDate(startDate);
    const endFormatted = formatICSDate(endDate);

    const eventUrl = `https://www.explorekadikoy.com/etkinlikler/${event.slug}`;
    const details = `Etkinlik Detayları: ${eventUrl}`;
    const location = event.venueName ? `${event.venueName}, Kadıköy, İstanbul` : 'Kadıköy, İstanbul';

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startFormatted}/${endFormatted}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;

    const generateIcsFile = () => {
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//ExploreKadikoy//TR',
            'BEGIN:VEVENT',
            `DTSTART:${startFormatted}`,
            `DTEND:${endFormatted}`,
            `SUMMARY:${event.title}`,
            `DESCRIPTION:${details}`,
            `LOCATION:${location}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n'); // ICS files must end lines with \r\n

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', `${event.slug}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsOpen(false);
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block', width: '100%', marginTop: '1rem' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    backgroundColor: '#18181b', // matching the card bg
                    color: '#a1a1aa',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(99, 102, 241, 0.4)', // subtle indigo border
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#27272a';
                    e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#18181b';
                    e.currentTarget.style.color = '#a1a1aa';
                }}
            >
                🗓️ Takvime Ekle
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '0.5rem',
                    backgroundColor: '#27272a',
                    border: '1px solid #3f3f46',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    zIndex: 50,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                }}>
                    <a
                        href={googleCalendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsOpen(false)}
                        style={{
                            display: 'block',
                            padding: '0.75rem 1rem',
                            color: '#e4e4e7',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            borderBottom: '1px solid #3f3f46',
                            transition: 'background-color 0.2s',
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3f3f46'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        🔵 Google Takvim
                    </a>
                    <button
                        onClick={generateIcsFile}
                        style={{
                            display: 'block',
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.75rem 1rem',
                            color: '#e4e4e7',
                            backgroundColor: 'transparent',
                            border: 'none',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            fontFamily: 'inherit'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3f3f46'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        🍎 Apple / Outlook
                    </button>
                </div>
            )}
        </div>
    );
}
