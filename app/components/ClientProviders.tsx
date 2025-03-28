'use client';

import React, { Suspense } from 'react';
import { ValentineProvider } from '../context/ValentineContext';

// Simple loading component for Suspense fallback
function Loading() {
  return <div className="p-4 text-center">Loading...</div>;
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Loading />}>
      <ValentineProvider>
        {children}
      </ValentineProvider>
    </Suspense>
  );
} 