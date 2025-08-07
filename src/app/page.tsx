"use client";

import { useState, useEffect } from "react";
import { generateTrackId, saveItem, getItemsByTrackId } from "@/lib/api";

interface SavedItem {
  id: string;
  itemName: string;
  price: number;
  category: string;
  url?: string;
  date: string;
}

const CATEGORIES = [
  "Food & Drinks",
  "Clothing",
  "Electronics",
  "Entertainment",
  "Books",
  "Home & Garden",
  "Beauty & Health",
  "Sports & Outdoors",
  "Other"
];

export default function Home() {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [url, setUrl] = useState("");
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [trackId, setTrackId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get or generate track_id
    let existingTrackId = localStorage.getItem("notTodayShopTrackId");
    if (!existingTrackId) {
      existingTrackId = generateTrackId();
      localStorage.setItem("notTodayShopTrackId", existingTrackId);
    }
    setTrackId(existingTrackId);
    
    // Fetch items from Supabase
    fetchItems(existingTrackId);
  }, []);
  
  const fetchItems = async (trackId: string) => {
    try {
      setLoading(true);
      const items = await getItemsByTrackId(trackId);
      const formattedItems = items.map((item: any) => ({
        id: item.id,
        itemName: item.name,
        price: item.price,
        category: item.category || "Other",
        url: item.url,
        date: item.saved_at
      }));
      setSavedItems(formattedItems);
      calculateTotalSavings(formattedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalSavings = (items: SavedItem[]) => {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    setTotalSavings(total);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemName || !price || !trackId) return;
    
    try {
      setLoading(true);
      
      // Save to Supabase
      await saveItem({
        track_id: trackId,
        name: itemName,
        price: parseFloat(price),
        category,
        url: url || undefined
      });
      
      // Refresh items from Supabase
      await fetchItems(trackId);
      
      // Clear form
      setItemName("");
      setPrice("");
      setCategory(CATEGORIES[0]);
      setUrl("");
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Failed to save item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Not Today Shop
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track what you didn&apos;t buy and watch your savings grow!
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Saved</p>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">
              ${totalSavings.toFixed(2)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                What did you resist buying?
              </label>
              <input
                type="text"
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Coffee, New shoes, Video game"
                required
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com/product"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Add to Savings"}
            </button>
          </form>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        )}
        
        {!loading && savedItems.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Items You Resisted
            </h2>
            <div className="space-y-3">
              {savedItems.slice().reverse().map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {item.itemName}
                      </h3>
                      {item.url && (
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
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.category} • {formatDate(item.date)}
                    </p>
                  </div>
                  <div className="text-green-600 dark:text-green-400 font-medium">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}