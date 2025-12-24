import { CompanyRegisterForm } from '@/components/company/CompanyRegisterForm'
import { getCurrentUser } from '@/lib/utils/auth'
import type { UserGrade } from '@/lib/types/auth.types'

export default async function CompanyRegisterPage() {
  const user = await getCurrentUser()
  const userGrade: UserGrade = (user?.userGrade as UserGrade) || 'basic'
  
  return <CompanyRegisterForm userGrade={userGrade} />
}




