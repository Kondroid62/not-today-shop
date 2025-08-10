'use client';

import { useState } from 'react';

interface TrackIdFormProps {
  onSubmit: (trackId: string) => void;
  currentTrackId: string | null;
}

export default function TrackIdForm({ onSubmit, currentTrackId }: TrackIdFormProps) {
  const [inputValue, setInputValue] = useState(currentTrackId || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
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
        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Set TrackID
      </button>
    </form>
  );
}