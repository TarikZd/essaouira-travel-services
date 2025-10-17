
'use client';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, Firestore } from 'firebase/firestore';

export async function saveBooking(firestore: Firestore, bookingData: any) {
    const bookingsCollection = collection(firestore, 'bookings');
    // The addDocumentNonBlocking function handles its own errors internally
    // so we don't need a try/catch block here.
    return addDocumentNonBlocking(bookingsCollection, bookingData);
}
