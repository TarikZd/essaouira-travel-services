import { differenceInDays } from 'date-fns';

// Anchored on Dec 21, 2024
const ANCHOR_DATE = new Date('2024-12-21');
const ANCHOR_TRIPS = 7962;
const ANCHOR_REVIEWS = 1783;

// Daily increments
const TRIPS_PER_DAY_MIN = 3;
const TRIPS_PER_DAY_MAX = 5;
const REVIEWS_PER_DAY_MIN = 3;
const REVIEWS_PER_DAY_MAX = 7;

// Average rates
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
