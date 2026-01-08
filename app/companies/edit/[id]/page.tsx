import { redirect } from 'next/navigation'
import { CompanyRegisterForm } from '@/components/company/CompanyRegisterForm'
import { getCurrentUser } from '@/lib/utils/auth'
import type { UserGrade } from '@/lib/types/auth.types'

interface EditCompanyPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCompanyPage({ params }: EditCompanyPageProps) {
  const { id } = await params
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const isAdmin = user?.isAdmin || false
  const userGrade: UserGrade = (user?.userGrade as UserGrade) || 'basic'

  return <CompanyRegisterForm companyId={id} isAdmin={isAdmin} userGrade={userGrade} />
}

