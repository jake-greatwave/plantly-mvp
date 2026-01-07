'use server'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Region = Database['public']['Tables']['regions']['Row']

export async function getRegions(regionType?: 'location' | 'country') {
  const supabase = await createClient()
  let query = supabase
    .from('regions')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  if (regionType) {
    query = query.eq('region_type', regionType)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getRegionById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('regions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}











