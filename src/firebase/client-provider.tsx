'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [firebaseServices, setFirebaseServices] = React.useState<ReturnType<typeof initializeFirebase> | null>(null);

  React.useEffect(() => {
    // Initialize Firebase client-side asynchronously to avoid blocking the main thread/LCP
    const services = initializeFirebase();
    setFirebaseServices(services);
  }, []);

  // While initializing, we can render children without Firebase context (if they don't break)
  // OR render nothing. For LCP, rendering children is best IF they handle missing context gracefully.
  // But typically usage strings context values.
  // A safe middle ground: If not initialized, rendering children might crash components expecting context.
  // HOWEVER, the landing page is server-rendered mostly? No, it's 'use client'.
  // Use a heuristic: If services are null, we pass partial/null values to provider?
  // Let's assume the safe bet: Render the provider with nulls/undefined if possible, OR block rendering children that NEED firebase.
  // Actually, standard Pattern: Render Children immediately if possible.
  
  // Real Fix: Deferring initialization means we might simply render children directly?
  // No, `FirebaseProvider` provides the context. 
  
  if (!firebaseServices) {
    // Return children directly (unwrapped) or Wrapped with partial context?
    // If we return children directly, `useAuth` hook calls deeper down might throw "must be used within Provider".
    // So we MUST render the Provider.
    return (
        <React.Fragment>{children}</React.Fragment>
    )    
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}