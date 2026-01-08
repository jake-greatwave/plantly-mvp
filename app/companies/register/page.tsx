import { redirect } from 'next/navigation'
import { CompanyRegisterForm } from '@/components/company/CompanyRegisterForm'
import { getCurrentUser } from '@/lib/utils/auth'
import type { UserGrade } from '@/lib/types/auth.types'

export default async function CompanyRegisterPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const userGrade: UserGrade = (user?.userGrade as UserGrade) || 'basic'
  
  return <CompanyRegisterForm userGrade={userGrade} />
}




