'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useValentine } from '../context/ValentineContext';

export default function SeeYa() {
  const { formRecord, selectedDate, loading, getGifSrc } = useValentine();
  const [gifSrc, setGifSrc] = useState('/assets/cat.gif');

  useEffect(() => {
    setGifSrc(getGifSrc());
  }, [getGifSrc]);

  if (loading) {
    return (
      <Layout gif={gifSrc}>
        <div className="text-center">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout gif={gifSrc} name={formRecord?.name}>
      <div className="text-center animate-fade-in space-y-4">
        <p className="text-2xl font-bold text-pink-600 mb-2">
          Can't wait for our date! ❤️
        </p>
        <p className="text-lg text-gray-700">
          See you on{" "}
          {new Date(selectedDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        {/* "Create your link" button */}
        <Link
          href="/create-form"
          className="block mt-6 px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors duration-300"
        >
          Create your link
        </Link>
      </div>
    </Layout>
  );
} 