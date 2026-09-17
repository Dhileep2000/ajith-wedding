import { weddingConfig } from '../config/weddingConfig';

/**
 * Generate Google Calendar URL
 */
export function getGoogleCalendarUrl(eventIndex?: number): string {
  const event = eventIndex !== undefined ? weddingConfig.events[eventIndex] : null;
  const title = event
    ? `${event.name} — ${weddingConfig.bride.firstName} & ${weddingConfig.groom.firstName}`
    : `${weddingConfig.bride.firstName} & ${weddingConfig.groom.firstName}'s Wedding`;
  const venue = event?.venue || `${weddingConfig.venue.name}, ${weddingConfig.venue.city}`;

  // Use the ISO date from config for reliable parsing
  const weddingDate = new Date(`${weddingConfig.wedding.date}T${weddingConfig.wedding.time}:00`);
  const endDate = new Date(weddingDate.getTime() + 3 * 60 * 60 * 1000);

  const startStr = formatDateForGoogle(weddingDate);
  const endStr = formatDateForGoogle(endDate);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startStr}/${endStr}`,
    location: venue,
    details: weddingConfig.invitation.subtitle,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate .ics file content for Apple/device calendar
 */
export function generateICSFile(eventIndex?: number): string {
  const event = eventIndex !== undefined ? weddingConfig.events[eventIndex] : null;
  const title = event
    ? `${event.name} — ${weddingConfig.bride.firstName} & ${weddingConfig.groom.firstName}`
    : `${weddingConfig.bride.firstName} & ${weddingConfig.groom.firstName}'s Wedding`;
  const venue = event?.venue || `${weddingConfig.venue.name}, ${weddingConfig.venue.city}`;

  const weddingDate = new Date(`${weddingConfig.wedding.date}T${weddingConfig.wedding.time}:00`);
  const endDate = new Date(weddingDate.getTime() + 3 * 60 * 60 * 1000);

  const startStr = formatDateForICS(weddingDate);
  const endStr = formatDateForICS(endDate);

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding//EN',
    'BEGIN:VEVENT',
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${title}`,
    `LOCATION:${venue}`,
    `DESCRIPTION:${weddingConfig.invitation.subtitle}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadICSFile(eventIndex?: number): void {
  const content = generateICSFile(eventIndex);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'wedding-invitation.ics';
  a.click();
  URL.revokeObjectURL(url);
}

function formatDateForGoogle(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function formatDateForICS(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}
