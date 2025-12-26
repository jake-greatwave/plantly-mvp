import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/utils/auth'
import { AccountSettingsContent } from '@/components/account/AccountSettingsContent'

export default async function AccountSettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return <AccountSettingsContent />
}

