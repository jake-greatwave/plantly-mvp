'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Factory, Cog, Eye, Hammer, Building2, Globe } from 'lucide-react'

const iconMap: Record<string, any> = {
  automation: Cog,
  mold: Hammer,
  vision: Eye,
  factory: Building2,
  manufacturing: Factory,
  global: Globe,
}

interface CategoryCardProps {
  id: string
  name: string
  code: string
  iconUrl?: string | null
}

export function CategoryCard({ id, name, code, iconUrl }: CategoryCardProps) {
  const router = useRouter()
  const Icon = iconMap[code] || Factory

  const handleClick = () => {
    router.push(`/companies?category=${id}`)
  }

  return (
    <Card
      onClick={handleClick}
      className="bg-white border-gray-200 p-5 hover:border-blue-600 hover:shadow-md transition-all cursor-pointer text-center"
    >
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
        {iconUrl ? (
          <img src={iconUrl} alt={name} className="w-6 h-6" />
        ) : (
          <Icon className="w-6 h-6" />
        )}
      </div>
      <div className="text-gray-900 text-sm font-medium">{name}</div>
    </Card>
  )
}

