'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/lib/types/database.types'

type Inquiry = Database['public']['Tables']['inquiries']['Row']
type InquiryInsert = Database['public']['Tables']['inquiries']['Insert']
type InquiryUpdate = Database['public']['Tables']['inquiries']['Update']

export async function createInquiry(inquiry: InquiryInsert) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('inquiries')
    .insert(inquiry)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/inquiries')
  return data
}

export async function getInquiriesByCompany(companyId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getInquiriesByUser(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('inquiries')
    .select('*, companies(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateInquiryStatus(id: string, status: 'pending' | 'replied' | 'closed') {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/inquiries')
  return data
}



