'use client';

import { useState, useEffect } from 'react';
import TrackIdForm from './TrackIdForm';
import TrackIdDisplay from './TrackIdDisplay';

interface SupabaseItem {
  id: string;
  name: string;
  price: number;
  category?: string;
  url?: string;
  saved_at: string;
  track_id: string;
}

interface TrackIdManagerProps {
  onTrackIdChange?: (trackId: string | null) => void;
}

export default function TrackIdManager({ onTrackIdChange }: TrackIdManagerProps) {
  const [trackId, setTrackId] = useState<string | null>(null);
  const [records, setRecords] = useState<SupabaseItem[]>([]);

  useEffect(() => {
    const savedTrackId = localStorage.getItem('notTodayShopTrackId');
    if (savedTrackId) {
      setTrackId(savedTrackId);
      searchRecords(savedTrackId);
    }
  }, []);

  const searchRecords = async (id: string) => {
    try {
      const { getItemsByTrackId } = await import('@/lib/api');
      const items = await getItemsByTrackId(id);
      setRecords(items);
    } catch (error) {
      console.error('Error searching records:', error);
      setRecords([]);
    }
  };

  const handleTrackIdSubmit = (newTrackId: string) => {
    setTrackId(newTrackId);
    searchRecords(newTrackId);
    
    if (onTrackIdChange) {
      onTrackIdChange(newTrackId);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Track ID Management</h2>
      
      <TrackIdForm 
        onSubmit={handleTrackIdSubmit}
        currentTrackId={trackId}
      />
      
      <TrackIdDisplay 
        trackId={trackId}
        hasRecords={records.length > 0}
        recordCount={records.length}
      />
    </div>
  );
}