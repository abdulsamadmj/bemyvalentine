'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import Layout from '../components/Layout';
import { useValentine } from '../context/ValentineContext';

export default function ThankYou() {
  const router = useRouter();
  const { formId, loading, getGifSrc } = useValentine();
  const [gifSrc, setGifSrc] = useState('/assets/cat.gif');

  useEffect(() => {
    setGifSrc(getGifSrc());
    
    // Show confetti
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const runConfetti = () => {
      const particleCount = 100;
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#ff0000", "#ff69b4", "#ff1493", "#ff007f", "#ffffff"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#ff0000", "#ff69b4", "#ff1493", "#ff007f", "#ffffff"],
      });
    };

    runConfetti();
    setTimeout(runConfetti, 100);
    setTimeout(runConfetti, 200);

    // Navigate to date picker after a delay
    const timeout = setTimeout(() => {
      router.push(`/date-picker${formId ? `?id=${formId}` : ''}`);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [router, formId, getGifSrc]);

  if (loading) {
    return (
      <Layout gif={gifSrc}>
        <div className="text-center">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout gif={gifSrc}>
      <div className="text-center animate-fade-in">
        <p className="text-3xl font-bold text-pink-600 animate-bounce">
          Hehee, Lezz Gooo! ❤️
        </p>
      </div>
    </Layout>
  );
} 