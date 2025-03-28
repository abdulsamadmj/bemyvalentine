'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

type ValentineContextType = {
  formId: string | null;
  formRecord: any | null;
  catPerson: boolean | null;
  selectedDate: string;
  yesScale: number;
  loading: boolean;
  setYesScale: React.Dispatch<React.SetStateAction<number>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  updateFormRecord: (data: any) => Promise<void>;
  getGifSrc: () => string;
};

const ValentineContext = createContext<ValentineContextType | undefined>(undefined);

export function ValentineProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const formId = searchParams.get('id');
  
  const [formRecord, setFormRecord] = useState<any>(null);
  const [catPerson, setCatPerson] = useState<boolean | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [yesScale, setYesScale] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (formId) {
      fetchFormRecord();
    } else {
      setLoading(false);
    }
  }, [formId]);

  const fetchFormRecord = async () => {
    setLoading(true);
    try {
      // Use the API route instead of direct Supabase access
      const response = await fetch(`/api/form?id=${formId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch form record');
      }
      
      const data = await response.json();
      
      setFormRecord(data);
      setCatPerson(data.catPerson);
    } catch (error) {
      console.error('Error fetching form record:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormRecord = async (updateData: any) => {
    if (!formId) return;

    try {
      // Use the API route instead of direct Supabase access
      const response = await fetch('/api/form/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formId,
          ...updateData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update form record');
      }
      
      // Refresh form record
      fetchFormRecord();
    } catch (error) {
      console.error('Error updating form record:', error);
    }
  };

  const getGifSrc = (): string => {
    if (catPerson === null) {
      return selectedDate
        ? Math.random() > 0.5 ? '/assets/cat.gif' : '/assets/dog-jumping.gif'
        : Math.random() > 0.5 ? '/assets/cat-please.gif' : '/assets/dog-please.gif';
    }
    
    return catPerson
      ? selectedDate
        ? '/assets/cat.gif'
        : '/assets/cat-please.gif'
      : selectedDate
        ? '/assets/dog-jumping.gif'
        : '/assets/dog-please.gif';
  };

  const value = {
    formId,
    formRecord,
    catPerson,
    selectedDate,
    yesScale,
    loading,
    setYesScale,
    setSelectedDate,
    updateFormRecord,
    getGifSrc,
  };

  return (
    <ValentineContext.Provider value={value}>
      {children}
    </ValentineContext.Provider>
  );
}

export function useValentine() {
  const context = useContext(ValentineContext);
  if (context === undefined) {
    throw new Error('useValentine must be used within a ValentineProvider');
  }
  return context;
} 