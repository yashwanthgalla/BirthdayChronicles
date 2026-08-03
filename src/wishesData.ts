// ============================================================================
// BIRTHDAY SPECIAL PAGE DATA - PICS OF US & BIRTHDAY WISHES
// Easily edit, add, or replace photos and wishes below!
// ============================================================================

export interface UsPhoto {
  id: string;
  url: string;
  title: string;
  date: string;
  location: string;
  caption: string;
}

export interface WishMessage {
  id: string;
  sender: string;
  relationship: string;
  message: string;
  avatarColor?: string;
  timestamp?: string;
  photoUrl?: string;
}

// ----------------------------------------------------------------------------
// 1. PICS OF US (Photos from /public/us)
// All 8 photos from /public/us included!
// ----------------------------------------------------------------------------
export const US_PHOTOS: UsPhoto[] = [
  {
    id: "us-1",
    url: "/us/photo_2026-05-22_15-47-57.jpg",
    title: "Golden Hour Memories",
    date: "2026.05.22",
    location: "OUR FAVORITE SPOT",
    caption: "Every single moment spent together becomes an unforgettable milestone."
  },
  {
    id: "us-2",
    url: "/us/photo_2026-06-10_17-14-16.jpg",
    title: "Endless Smiles",
    date: "2026.06.10",
    location: "SUNSET POINT",
    caption: "Your laughter is my favorite sound in the whole wide universe."
  },
  {
    id: "us-3",
    url: "/us/photo_2026-06-10_17-49-59.jpg",
    title: "Sunlit Frequencies",
    date: "2026.06.10",
    location: "COASTAL HORIZON",
    caption: "Capturing the pure joy of sunlit moments."
  },
  {
    id: "us-4",
    url: "/us/photo_2026-07-26_17-08-54.jpg",
    title: "Together Forever",
    date: "2026.07.26",
    location: "THE ARCHIVE STUDIO",
    caption: "Side by side through every chapter of life."
  },
  {
    id: "us-5",
    url: "/us/photo_2026-08-03_22-17-52.jpg",
    title: "Birthday Magic",
    date: "2026.08.03",
    location: "CELEBRATION VENUE",
    caption: "Celebrating another wonderful year of unforgettable memories."
  },
  {
    id: "us-6",
    url: "/us/photo_2026-08-03_22-18-03.jpg",
    title: "Radiant Joy",
    date: "2026.08.03",
    location: "BDAY ARCHIVE",
    caption: "Pure happiness captured in the moment."
  },
  {
    id: "us-7",
    url: "/us/photo_2026-08-03_22-18-13.jpg",
    title: "Unforgettable Moments",
    date: "2026.08.03",
    location: "SPECIAL NIGHTS",
    caption: "Treasured memories we will hold forever."
  },
  {
    id: "us-8",
    url: "/us/photo_2026-08-03_22-18-17.jpg",
    title: "Forever Cadence",
    date: "2026.08.03",
    location: "HER HEART",
    caption: "Our frequencies matched perfectly in time."
  }
];

// ----------------------------------------------------------------------------
// 2. BIRTHDAY WISHES & MESSAGES
// Manually add or edit wishes below!
// To add a photo for a person:
// Save their picture in public/wish/ (e.g. public/wish/yashu.jpg)
// and set photoUrl: "/wish/yashu.jpg"
// ----------------------------------------------------------------------------
export const WISHES_MESSAGES: WishMessage[] = [
  {
    id: "wish-1",
    sender: "With All My Love ❤️",
    relationship: "YOUR FAVORITE PERSON",
    message: "Happy Birthday my love! You deserve all the happiness, laughter, and magic in the world. Thank you for being my constant joy and inspiration.",
    avatarColor: "linear-gradient(135deg, rgba(232, 145, 60, 0.2), var(--secondary-ground))",
    timestamp: "08.03.2026",
    photoUrl: "/wish/favorite-person.jpg"
  },
  {
    id: "wish-2",
    sender: "Best Friends Crew ✨",
    relationship: "BESTIES",
    message: "Wishing the sweetest, happiest birthday to our favorite girl! May this year bring endless adventures, success, and pure magic!",
    avatarColor: "linear-gradient(135deg, rgba(46, 107, 114, 0.2), var(--secondary-ground))",
    timestamp: "08.03.2026",
    photoUrl: "/wish/besties.jpg"
  },
  {
    id: "wish-3",
    sender: "Family & Loved Ones 🏡",
    relationship: "FAMILY",
    message: "Happy Birthday! Sending you tight hugs, endless love, and blessings for a year filled with good health, joy, and dreams come true.",
    avatarColor: "linear-gradient(135deg, rgba(232, 145, 60, 0.2), var(--secondary-ground))",
    timestamp: "08.03.2026",
    photoUrl: "/wish/family.jpg"
  }
];
