'use server'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Category = Database['public']['Tables']['categories']['Row']

export async function getCategories(parentId?: string | null) {
  const supabase = await createClient()
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
  return data
}

export async function getCategoriesWithChildren() {
  const supabase = await createClient()
  const { data: parentCategories, error: parentError } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .eq('is_active', true)
    .order('display_order')

  if (parentError) throw parentError

  const categoriesWithChildren = await Promise.all(
    parentCategories.map(async (parent) => {
      const { data: children, error: childError } = await supabase
        .from('categories')
        .select('*')
        .eq('parent_id', parent.id)
        .eq('is_active', true)
        .order('display_order')

      if (childError) throw childError

      return {
        ...parent,
        children: children || []
      }
    })
  )

  return categoriesWithChildren
}

export async function getCategoryById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}





