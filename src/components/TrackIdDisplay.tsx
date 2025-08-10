'use client';

interface TrackIdDisplayProps {
  trackId: string | null;
  hasRecords: boolean;
  recordCount?: number;
}

export default function TrackIdDisplay({ trackId, hasRecords, recordCount = 0 }: TrackIdDisplayProps) {
  if (!trackId) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-yellow-800 dark:text-yellow-200">No TrackID set. Please enter a TrackID to start tracking.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Current TrackID:</span>
        <span className="font-mono text-lg font-semibold text-gray-900 dark:text-gray-100">{trackId}</span>
      </div>
      
      {hasRecords ? (
        <p className="text-sm text-green-600 dark:text-green-400">
          ✓ {recordCount} record{recordCount !== 1 ? 's' : ''} found
        </p>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No records found for this TrackID
        </p>
      )}
    </div>
  );
}