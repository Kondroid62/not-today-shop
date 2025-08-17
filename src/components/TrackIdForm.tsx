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
        className="glass-input"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="glass-button-primary inline-flex items-center px-6 py-3 hover:scale-[1.05]"
      >
        {isLoading ? 'Checking...' : 'Search'}
      </button>
    </form>
  );
}