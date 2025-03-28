'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from './components/Layout';
import { useValentine } from './context/ValentineContext';
import Link from 'next/link';

// Loading component
function Loading() {
  return (
    <Layout gif="/assets/cat-please.gif">
      <div className="text-center">Loading...</div>
    </Layout>
  );
}

// Main page content
function HomeContent() {
  const router = useRouter();
  const { formId, formRecord, yesScale, setYesScale, loading, getGifSrc } = useValentine();
  const [gifSrc, setGifSrc] = useState('/assets/cat-please.gif');
  const [sadGif, setSadGif] = useState('/assets/cat-sad.jpg');

  useEffect(() => {
    setGifSrc(getGifSrc());
    // Set the sad gif based on the pet preference
    if (formRecord?.catPerson === false) {
      setSadGif('/assets/dog-sad.gif');
    } else {
      setSadGif('/assets/cat-sad.jpg');
    }
  }, [getGifSrc, formRecord]);

  const handleNoClick = () => {
    setYesScale((prev) => prev + 0.15);
    setGifSrc(sadGif);
    
    // Reset the gif after 500ms
    setTimeout(() => {
      setGifSrc(getGifSrc());
    }, 500);
  };

  const handleYesClick = () => {
    router.push(`/hehe${formId ? `?id=${formId}` : ''}`);
  };

  if (loading) {
    return (
      <Layout gif={gifSrc}>
        <div className="text-center">Loading...</div>
      </Layout>
    );
  }

  // If no id or an invalid id is provided and we're not on create-form page, show alternative UI
  if (!formId && !formRecord) {
    return (
      <Layout gif={gifSrc}>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-pink-600 mb-6">
            Ask out your valentine
          </h2>
          <Link
            href="/create-form"
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Get your link
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout gif={gifSrc} name={formRecord?.name}>
      <div className="flex items-center justify-center gap-4">
        <div className="-rotate-45 mr-10">
          <button
            onClick={handleYesClick}
            style={{
              transform: `scale(${yesScale})`,
              transition: "transform 0.3s ease",
              rotate: "90deg",
            }}
            className="heart-button relative w-20 h-20 bg-red-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
          >
            <p className="-rotate-45 z-50 -mt-3">Yes! 😊</p>
          </button>
        </div>
        <button
          onClick={handleNoClick}
          className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors duration-300"
        >
          No 😢
        </button>
      </div>
    </Layout>
  );
}

// Wrap the component with Suspense
export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <HomeContent />
    </Suspense>
  );
}
