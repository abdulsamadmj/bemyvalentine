'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import Layout from './components/Layout';

// Simple loading component for Suspense fallback
function Loading() {
  return (
    <Layout gif="/assets/cat-sad.jpg">
      <div className="text-center">Loading...</div>
    </Layout>
  );
}

// Error content component
function ErrorContent({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Layout gif="/assets/cat-sad.jpg">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-pink-600">Something went wrong</h2>
        <p className="text-gray-700">
          We apologize for the inconvenience. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors duration-300"
          >
            Go Home
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <ErrorContent error={error} reset={reset} />
    </Suspense>
  );
} 