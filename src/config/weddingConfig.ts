// ============================================================
// WEDDING CONFIGURATION — Edit this file to customize everything
// ============================================================

export const weddingConfig = {
  // ── Couple ────────────────────────────────────────────────
  bride: {
    firstName: 'Ajith Kumar',
    lastName: '',
    title: 'The Groom',
  },
  groom: {
    firstName: 'Sneha',
    lastName: '',
    title: 'The Bride',
  },

  // ── Date & Time ──────────────────────────────────────────
  wedding: {
    date: '2026-12-14',
    time: '19:00',
    displayDate: 'December 14, 2026',
    displayTime: '7:00 PM IST',
    month: 'December',
    year: 2026,
    day: 14,
  },

  // ── Venue ────────────────────────────────────────────────
  venue: {
    name: 'The Leela Palace',
    city: 'Udaipur',
    address: 'The Leela Palace Udaipur, Lake Pichola, Udaipur, Rajasthan 313001',
    mapLink: 'https://maps.google.com/?q=The+Leela+Palace+Udaipur',
    coordinates: { lat: 24.5672, lng: 73.6822 },
  },

  // ── Invitation Message ──────────────────────────────────
  invitation: {
    tagline: 'A Beautiful Journey Begins',
    label: 'An Indian Wedding Celebration',
    heading: ['Two Souls.', 'One Beautiful Journey.'],
    subtitle:
      'Together with their families, they invite you to celebrate the beginning of their forever.',
    cta: 'Enter the Celebration',
    cardMessage:
      'With the blessings of our families, we joyfully invite you to share in the celebration of our union. Your presence will make our day truly complete.',
  },

  // ── Events ──────────────────────────────────────────────
  events: [
    {
      id: 'mehendi',
      name: 'Mehendi',
      icon: '🌿',
      date: 'December 12, 2026',
      time: '4:00 PM',
      venue: 'The Leela Palace — Courtyard',
      description: 'An afternoon of colors, music, and beautiful henna art.',
    },
    {
      id: 'sangeet',
      name: 'Sangeet',
      icon: '🎶',
      date: 'December 13, 2026',
      time: '7:00 PM',
      venue: 'The Leela Palace — Grand Ballroom',
      description: 'A night of dance, music, and celebration with family and friends.',
    },
    {
      id: 'wedding',
      name: 'Wedding Ceremony',
      icon: '💍',
      date: 'December 14, 2026',
      time: '7:00 PM',
      venue: 'The Leela Palace — Lake Pavilion',
      description: 'The sacred ceremony where two souls become one.',
    },
    {
      id: 'reception',
      name: 'Reception',
      icon: '✨',
      date: 'December 14, 2026',
      time: '9:00 PM',
      venue: 'The Leela Palace — Grand Ballroom',
      description: 'An evening of joy, laughter, and celebration.',
    },
  ],

  // ── Story Chapters ──────────────────────────────────────
  story: [
    { id: 'first-hello', title: 'First Hello', caption: 'A chance meeting that changed everything.', year: '2021' },
    { id: 'first-memory', title: 'First Memory', caption: 'The first of a thousand beautiful moments.', year: '2022' },
    { id: 'the-journey', title: 'The Journey', caption: 'Adventures, laughter, and growing together.', year: '2023' },
    { id: 'the-proposal', title: 'The Proposal', caption: 'The moment she said yes.', year: '2025' },
    { id: 'forever-begins', title: 'Forever Begins', caption: 'And so, a new chapter begins.', year: '2026' },
  ],

  // ── Music ───────────────────────────────────────────────
  music: { title: 'Our Song', url: '', artist: '' },

  // ── Social / Sharing ────────────────────────────────────
  share: {
    message: "You're invited to Ajith Kumar & Sneha's wedding! 💕",
    url: '',
  },

  // ── Video Background (no longer used) ───────────────────
  video: { src: '' },

  // ── RSVP ────────────────────────────────────────────────
  rsvp: {
    heading: 'Will You Celebrate With Us?',
    yesButton: "Yes, I'll Be There",
    noButton: "Sorry, I Can't Make It",
    confirmationMessage: "We can't wait to see you.",
    declineMessage: 'You will be missed. We hope to celebrate with you soon. 💛',
  },

  // ── Final Scene ─────────────────────────────────────────
  finale: {
    line1: 'And So,',
    line2: 'Their Next Chapter Begins.',
    closing: 'See You There',
    replay: 'Back to Top',
  },

  // ── Color Palette ───────────────────────────────────────
  colors: {
    ivory: '#FAF6F0',
    cream: '#F5E6D0',
    champagne: '#D4A574',
    deepGold: '#8B6914',
    warmCharcoal: '#2D2A26',
    richBlack: '#1A1714',
    softBlush: '#E8D5C4',
    mutedRose: '#C4A882',
  },
} as const;

export type WeddingConfig = typeof weddingConfig;
export type WeddingEvent = (typeof weddingConfig.events)[number];
export type StoryChapter = (typeof weddingConfig.story)[number];
