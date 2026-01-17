/**
 * Generates a human-readable booking reference number
 * Format: ESS-YYYY-SHORTID
 * Example: ESS-2026-A1B2C3D4
 */
export function generateBookingReference(bookingId: string): string {
  const year = new Date().getFullYear();
  const shortId = bookingId.substring(0, 8).toUpperCase().replace(/-/g, '');
  return `ESS-${year}-${shortId}`;
}

/**
 * Validates a booking reference format
 */
export function isValidBookingReference(reference: string): boolean {
  const pattern = /^ESS-\d{4}-[A-Z0-9]{8}$/;
  return pattern.test(reference);
}
