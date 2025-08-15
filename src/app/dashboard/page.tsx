'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getItemsByTrackId } from '@/lib/api';

interface SavedItem {
  id: string;
  itemName: string;
  price: number;
  category: string;
  url?: string;
  date: string;
}

interface SupabaseItem {
  id: string;
  name: string;
  price: number;
  category?: string;
  url?: string;
  saved_at: string;
}

export default function DashboardPage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [trackId, setTrackId] = useState<string>('');

  useEffect(() => {
    // First try sessionStorage, then localStorage
    let storedTrackId = sessionStorage.getItem('trackId');
    if (!storedTrackId) {
      storedTrackId = localStorage.getItem('notTodayShopTrackId');
    }
    
    if (storedTrackId) {
      setTrackId(storedTrackId);
      fetchItems(storedTrackId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchItems = async (trackIdParam: string) => {
    try {
      setLoading(true);
      const items = await getItemsByTrackId(trackIdParam);
      const formattedItems = items.map((item: SupabaseItem) => ({
        id: item.id,
        itemName: item.name,
        price: item.price,
        category: item.category || 'Other',
        url: item.url,
        date: item.saved_at
      }));
      setItems(formattedItems);
      const total = formattedItems.reduce((sum: number, item: SavedItem) => sum + item.price, 0);
      setTotalSavings(total);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return `¥${price}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 pt-8">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-2">Total Savings</p>
            <p className="text-5xl font-bold text-green-600 dark:text-green-400">{formatPrice(totalSavings)}</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Total items: {items.length}</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">All Saved Items</h2>
            
            {items.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No saved items yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Item Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">URL</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">{formatDate(item.date)}</td>
                        <td className="py-3 px-4 text-gray-800 dark:text-gray-200 font-medium">{item.itemName}</td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {item.url ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              title="View product"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-600">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-green-600 dark:text-green-400">
                          {formatPrice(item.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}