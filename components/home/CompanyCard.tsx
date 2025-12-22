'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2 } from 'lucide-react'

interface CompanyCardProps {
  id: string
  name: string
  logoUrl?: string | null
  description?: string | null
  location?: string
  tags?: Array<{ tag_name: string }>
  categories?: Array<{ categories: { category_name: string } | null }>
}

export function CompanyCard({ 
  id, 
  name, 
  logoUrl, 
  description, 
  location,
  tags = [],
  categories = []
}: CompanyCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/companies/${id}`)
  }

  const displayTags = tags.length > 0 
    ? tags.slice(0, 3).map(t => `#${t.tag_name}`)
    : categories.slice(0, 3).map(c => c.categories?.category_name).filter(Boolean).map(name => `#${name}`)

  return (
    <Card
      onClick={handleClick}
      className="bg-white border-gray-200 p-5 hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
          {logoUrl ? (
            <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="w-7 h-7 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 font-semibold mb-0.5 truncate">{name}</h3>
          {location && (
            <p className="text-sm text-gray-500 truncate">{location}</p>
          )}
        </div>
      </div>
      {description && (
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
          {description}
        </p>
      )}
      {displayTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {displayTags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-50 text-xs px-2 py-0.5">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  )
}


