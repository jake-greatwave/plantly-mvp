import { CompanyRegisterForm } from '@/components/company/CompanyRegisterForm'
import { getCurrentUser } from '@/lib/utils/auth'

interface EditCompanyPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCompanyPage({ params }: EditCompanyPageProps) {
  const { id } = await params
  const user = await getCurrentUser()
  const isAdmin = user?.isAdmin || false

  return <CompanyRegisterForm companyId={id} isAdmin={isAdmin} />
}

