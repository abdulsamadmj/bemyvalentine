'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { useValentine } from '../context/ValentineContext';

export default function DatePicker() {
  const router = useRouter();
  const { formId, formRecord, selectedDate, setSelectedDate, updateFormRecord, loading, getGifSrc } = useValentine();
  const [gifSrc, setGifSrc] = useState('/assets/cat.gif');

  useEffect(() => {
    setGifSrc(getGifSrc());
  }, [getGifSrc]);

  const handleDateConfirm = async () => {
    if (!selectedDate) {
      toast.error('Please select a date first!');
      return;
    }

    try {
      await updateFormRecord({ response: selectedDate });
      router.push(`/see-ya${formId ? `?id=${formId}` : ''}`);
    } catch (error) {
      toast.error('Error updating date. Please try again.');
    }
  };

  if (loading) {
    return (
      <Layout gif={gifSrc}>
        <div className="text-center">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout gif={gifSrc} name={formRecord?.name}>
      <div className="space-y-4 animate-fade-in">
        <p className="text-center text-pink-600 font-medium mb-4">
          Pick a date for our DATE! 📅
        </p>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border-2 border-pink-300 focus:border-pink-500 focus:outline-none"
        />
        <button
          onClick={handleDateConfirm}
          className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          Set Date ❤️
        </button>
      </div>
    </Layout>
  );
} 