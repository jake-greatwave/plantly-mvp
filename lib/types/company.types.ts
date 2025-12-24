export interface Company {
  id: string
  user_id: string
  business_number: string
  company_name: string
  ceo_name: string
  establishment_date: string | null
  address: string | null
  address_detail: string | null
  manager_name: string | null
  manager_position: string | null
  manager_phone: string | null
  logo_url: string | null
  intro_title: string | null
  intro_content: string | null
  is_verified: boolean
  is_featured: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export interface CompanyFormData {
  business_number: string
  company_name: string
  ceo_name: string
  establishment_date?: string
  address?: string
  address_detail?: string
  manager_name?: string
  manager_position?: string
  manager_phone?: string
  logo_url?: string
  intro_title?: string
  intro_content?: string
}

export interface CompanyWithRelations extends Company {
  categories?: Array<{
    id: string
    category_name: string
    category_code: string
  }>
  regions?: Array<{
    id: string
    region_name: string
    region_type: 'location' | 'country'
  }>
  images?: Array<{
    id: string
    image_url: string
    image_type: 'main' | 'portfolio' | 'facility' | null
    display_order: number
  }>
  tags?: Array<{
    id: string
    tag_name: string
  }>
}





