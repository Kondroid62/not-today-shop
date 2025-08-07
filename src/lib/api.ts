// src/lib/api.ts
import { supabase } from './supabase'

// track_id発行（フロントエンドで生成）
export const generateTrackId = () => {
  return Math.random().toString(36).slice(2, 10) // 8文字のID
}

// アイテム保存
export const saveItem = async (itemData: {
  track_id: string
  name: string
  price: number
  category?: string
  url?: string
}) => {
  const { data, error } = await supabase
    .from('saved_items')
    .insert(itemData)
    .select()

  if (error) throw error
  return data
}

// track_idで抽出
export const getItemsByTrackId = async (trackId: string) => {
  const { data, error } = await supabase
    .from('saved_items')
    .select('*')
    .eq('track_id', trackId)
    .order('saved_at', { ascending: false })

  if (error) throw error
  return data
}

// 統計計算
export const getTrackingStats = async (trackId: string) => {
  const items = await getItemsByTrackId(trackId)
  
  return {
    total_saved: items.reduce((sum, item) => sum + item.price, 0),
    item_count: items.length,
    average_price: items.length > 0 ? 
      Math.round(items.reduce((sum, item) => sum + item.price, 0) / items.length) : 0
  }
}
