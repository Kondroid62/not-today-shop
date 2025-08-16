"use client";

import { useState, useEffect } from "react";
import { saveItem, getItemsByTrackId } from "@/lib/api";
import TrackIdManager from "@/components/TrackIdManager";
import Image from "next/image";
import Logo from "@/images/not-today-shop-logo.svg";
import Link from "next/link";

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

  const fetchItems = async (trackIdParam: string) => {
    try {
      setLoading(true);
      const items = await getItemsByTrackId(trackIdParam);
      const formattedItems = items.map((item: SupabaseItem) => ({
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

  useEffect(() => {
    // TrackIdManagerが初期化を行うので、ここでは何もしない
    // TrackIdはTrackIdManagerのonTrackIdChangeで設定される
  }, []);

  const handleTrackIdChange = (newTrackId: string | null) => {
    if (newTrackId) {
      setTrackId(newTrackId);
      sessionStorage.setItem('trackId', newTrackId);
      fetchItems(newTrackId);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 pt-8">
          <Image
            src={Logo}
            alt="Not Today Shop Logo"
            width={200}
            height={80}
            className="mx-auto mb-2"
          />
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
            Not Today Shop
          </h1>
          <p className="text-white/80 drop-shadow-md">
            Track what you didn&apos;t buy and watch your savings grow!
          </p>
        </header>

        <TrackIdManager onTrackIdChange={handleTrackIdChange} />

        {/* メインカード - グラスモーフィズム */}
        <div className="glass-card p-6 mb-8">
          <div className="text-center mb-6">
            <p className="text-sm text-white/80 mb-2">Total Saved</p>
            <p className="text-4xl font-bold text-white drop-shadow-lg">
              ¥{totalSavings}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="itemName" className="glass-label">
                What did you resist buying?
              </label>
              <input
                type="text"
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="glass-input"
                placeholder="e.g., Coffee, New shoes, Video game"
                required
              />
            </div>

            <div>
              <label htmlFor="url" className="glass-label">
                Product URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="glass-input"
                placeholder="https://example.com/product"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="glass-label">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/80">
                    ¥
                  </span>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="glass-input pl-7"
                    placeholder="0"
                    step="1"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="category" className="glass-label">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="glass-select"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-gray-800 text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="glass-button w-full py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Add to Savings"}
            </button>
          </form>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-white/80">Loading...</p>
          </div>
        )}
        
        {!loading && savedItems.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg mb-4">
              Recent Items You Resisted Buying
            </h2>
            <div className="space-y-3">
              {savedItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="glass-item-card p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white">
                        {item.itemName}
                      </h3>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/80 hover:text-white transition-colors duration-200"
                          title="View product"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-white/70">
                      {item.category} • {formatDate(item.date)}
                    </p>
                  </div>
                  <div className="text-green-300 font-bold text-lg drop-shadow-md">
                    ¥{item.price}
                  </div>
                </div>
              ))}
            </div>
            {savedItems.length > 5 && (
              <div className="mt-6 text-center">
                <Link
                  href="/dashboard"
                  className="glass-button inline-flex items-center px-6 py-3 hover:scale-[1.05]"
                >
                  Show more
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
