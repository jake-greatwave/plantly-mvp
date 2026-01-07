'use client'

import { useSupabase } from './useSupabase'
import { useEffect, useState } from 'react'
import type { Database } from '@/lib/types/database.types'

type Region = Database['public']['Tables']['regions']['Row']

export function useRegions(regionType?: 'location' | 'country') {
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = useSupabase()

  useEffect(() => {
    const fetchRegions = async () => {
      try {
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
        setRegions(data || [])
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchRegions()
  }, [supabase, regionType])

  return { regions, loading, error }
}









