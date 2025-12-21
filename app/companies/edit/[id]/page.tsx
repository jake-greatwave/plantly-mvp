import { CompanyRegisterForm } from '@/components/company/CompanyRegisterForm'

interface EditCompanyPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCompanyPage({ params }: EditCompanyPageProps) {
  const { id } = await params

  return <CompanyRegisterForm companyId={id} />
}

