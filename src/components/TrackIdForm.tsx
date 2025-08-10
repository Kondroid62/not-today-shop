'use client';

import { useState } from 'react';

interface TrackIdFormProps {
  onSubmit: (trackId: string) => void | Promise<void>;
  currentTrackId: string | null;
  isLoading?: boolean;
}

export default function TrackIdForm({ onSubmit, currentTrackId, isLoading = false }: TrackIdFormProps) {
  const [inputValue, setInputValue] = useState(currentTrackId || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSubmit(inputValue.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter TrackID"
        disabled={isLoading}
        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Checking...' : 'Set TrackID'}
      </button>
    </form>
  );
}