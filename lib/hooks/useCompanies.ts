'use client'

import { useSupabase } from './useSupabase'
import { useEffect, useState } from 'react'
import type { Database } from '@/lib/types/database.types'

type Company = Database['public']['Tables']['companies']['Row']

export function useCompanies(filters?: {
  is_verified?: boolean
  is_featured?: boolean
  search?: string
}) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = useSupabase()

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        let query = supabase
          .from('companies')
          .select('*')

        if (filters?.is_verified !== undefined) {
          query = query.eq('is_verified', filters.is_verified)
        }

        if (filters?.is_featured !== undefined) {
          query = query.eq('is_featured', filters.is_featured)
        }

        if (filters?.search) {
          query = query.or(`company_name.ilike.%${filters.search}%,intro_title.ilike.%${filters.search}%`)
        }

        const { data, error } = await query

        if (error) throw error
        setCompanies(data || [])
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [supabase, filters?.is_verified, filters?.is_featured, filters?.search])

  return { companies, loading, error }
}

export function useCompany(id: string | null) {
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = useSupabase()

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchCompany = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        setCompany(data)
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchCompany()
  }, [supabase, id])

  return { company, loading, error }
}












