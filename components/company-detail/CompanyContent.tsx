'use client'

import { Card } from '@/components/ui/card'
import type { CompanyDetail } from '@/lib/types/company-detail.types'

interface CompanyContentProps {
  company: CompanyDetail
}

export function CompanyContent({ company }: CompanyContentProps) {
  if (!company.content) {
    return null
  }

  return (
    <Card className="p-6">
      <div
        className="prose prose-sm max-w-none [&_*]:max-w-full [&_img]:max-w-full [&_img]:h-auto [&_p]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2"
        dangerouslySetInnerHTML={{ __html: company.content }}
      />
    </Card>
  )
}

