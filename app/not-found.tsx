'use client';

import { Suspense } from 'react';
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

// Main not found content
function NotFoundContent() {
  return (
    <Layout gif="/assets/cat-sad.jpg">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-pink-600">404 - Not Found</h2>
        <p className="text-gray-700">Oops! The page you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          Go Home
        </Link>
      </div>
    </Layout>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<Loading />}>
      <NotFoundContent />
    </Suspense>
  );
} 