import { differenceInDays } from 'date-fns';
import { subDays } from 'date-fns';

// Anchored on Jan 10, 2026 to start with specific counts
const ANCHOR_DATE = new Date('2026-01-10');
// Base reviews requested (378 total)
const ANCHOR_REVIEWS = 378; 
const ANCHOR_TRIPS = 1250; // Adjusted relative to reviews

// Branding: Growth
// 70% of growth will be Cooking/Fishing (Handled in Reviews.tsx content generation)
// Here we just define the COUNT growth.
const TRIPS_PER_DAY_MIN = 2;
const TRIPS_PER_DAY_MAX = 5;
const REVIEWS_PER_DAY_MIN = 1; // Slower growth for authenticity
const REVIEWS_PER_DAY_MAX = 3;

const AVG_TRIPS = (TRIPS_PER_DAY_MIN + TRIPS_PER_DAY_MAX) / 2;
const AVG_REVIEWS = (REVIEWS_PER_DAY_MIN + REVIEWS_PER_DAY_MAX) / 2;

export function getDynamicMetrics() {
  const now = new Date();
  const daysPassed = Math.max(0, differenceInDays(now, ANCHOR_DATE));

  const totalTrips = Math.floor(ANCHOR_TRIPS + (daysPassed * AVG_TRIPS));
  const totalReviews = Math.floor(ANCHOR_REVIEWS + (daysPassed * AVG_REVIEWS));

  return {
    trips: totalTrips,
    reviews: totalReviews
  };
}
