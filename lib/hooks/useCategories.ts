'use client'

import { useSupabase } from './useSupabase'
import { useEffect, useState } from 'react'
import type { Database } from '@/lib/types/database.types'

type Category = Database['public']['Tables']['categories']['Row']

export function useCategories(parentId?: string | null) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = useSupabase()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let query = supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order')

        if (parentId === null) {
          query = query.is('parent_id', null)
        } else if (parentId) {
          query = query.eq('parent_id', parentId)
        }

        const { data, error } = await query

        if (error) throw error
        setCategories(data || [])
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [supabase, parentId])

  return { categories, loading, error }
}






