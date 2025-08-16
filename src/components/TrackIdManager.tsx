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
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const generateRandomTrackId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${randomStr}`;
  };

  useEffect(() => {
    const initializeTrackId = async () => {
      let savedTrackId = localStorage.getItem('notTodayShopTrackId');
      
      if (!savedTrackId) {
        savedTrackId = generateRandomTrackId();
        localStorage.setItem('notTodayShopTrackId', savedTrackId);
      }
      
      setTrackId(savedTrackId);
      await searchRecords(savedTrackId);
      
      if (onTrackIdChange) {
        onTrackIdChange(savedTrackId);
      }
    };
    
    initializeTrackId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchRecords = async (id: string, showError = false) => {
    try {
      const { getItemsByTrackId } = await import('@/lib/api');
      const items = await getItemsByTrackId(id);
      setRecords(items);
      
      if (showError && items.length === 0) {
        setError('This Track ID is not found');
        return false;
      }
      
      setError(null);
      return items.length > 0;
    } catch (error) {
      console.error('Error searching records:', error);
      setRecords([]);
      if (showError) {
        setError('Error searching for Track ID');
      }
      return false;
    }
  };

  const handleTrackIdSubmit = async (newTrackId: string) => {
    if (!newTrackId.trim()) {
      return;
    }
    
    const trimmedId = newTrackId.trim();
    setError(null);
    setIsChecking(true);
    
    try {
      const hasRecords = await searchRecords(trimmedId, true);
      
      if (hasRecords) {
        setTrackId(trimmedId);
        localStorage.setItem('notTodayShopTrackId', trimmedId);
        
        if (onTrackIdChange) {
          onTrackIdChange(trimmedId);
        }
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="glass-card p-6 mb-8 space-y-4 hover:bg-white/20">
      <h2 className="text-xl font-semibold text-white drop-shadow-lg">Track ID Management</h2>
      
      <div className="space-y-2">
        <TrackIdForm 
          onSubmit={handleTrackIdSubmit}
          currentTrackId={trackId}
          isLoading={isChecking}
        />
        
        {error && (
          <div className="glass-error p-3">
            <p className="text-sm text-red-100 drop-shadow-md">{error}</p>
          </div>
        )}
      </div>
      
      <TrackIdDisplay 
        trackId={trackId}
        hasRecords={records.length > 0}
        recordCount={records.length}
      />
    </div>
  );
}
