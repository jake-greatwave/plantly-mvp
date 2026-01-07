'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, MapPin, Star, CheckCircle2 } from 'lucide-react'
import { formatAddressShort } from '@/lib/utils/address'

interface CompanyCardProps {
  id: string
  name: string
  mainImage?: string | null
  logoUrl?: string | null
  description?: string | null
  location?: string
  tags?: Array<{ tag_name: string }>
  categories?: Array<{ categories: { category_name: string } | null }>
  isVerified?: boolean
  isFeatured?: boolean
  ceoName?: string | null
  industries?: any
}

export function CompanyCard({ 
  id, 
  name, 
  mainImage,
  logoUrl, 
  description, 
  location,
  tags = [],
  categories = [],
  isVerified = false,
  isFeatured = false,
  ceoName,
  industries
}: CompanyCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/companies/${id}`)
  }

  const allTags = tags.length > 0 
    ? tags.map(t => `#${t.tag_name}`)
    : categories.map(c => c.categories?.category_name).filter(Boolean).map(name => `#${name}`)
  
  const displayTags = allTags.slice(0, 3)
  const remainingCount = Math.max(0, allTags.length - 3)

  const imageToShow = mainImage || logoUrl

  const industryList = industries
    ? (typeof industries === "string"
        ? JSON.parse(industries)
        : industries)
    : null

  const industryArray = Array.isArray(industryList)
    ? industryList
    : typeof industryList === "object" && industryList !== null
    ? Object.values(industryList)
    : []

  return (
    <Card
      onClick={handleClick}
      className="bg-white border-gray-200 overflow-hidden hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex">
        <div className="relative w-28 h-28 flex-shrink-0 bg-white overflow-hidden p-2">
          {imageToShow ? (
            <img 
              src={imageToShow} 
              alt={name} 
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white rounded">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
          )}
          {isFeatured && (
            <div className="absolute top-1 right-1">
              <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0.5">
                <Star className="w-2.5 h-2.5 mr-0.5" />
                추천
              </Badge>
            </div>
          )}
        </div>

        <div className="p-3 flex-1 flex flex-col min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
            {name}
          </h3>

          {description && (
            <p className="text-gray-700 text-xs mb-2 line-clamp-2">
              {description}
            </p>
          )}

          <div className="space-y-1 mb-2 flex-1">
            {location && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span className="line-clamp-1">{formatAddressShort(location)}</span>
              </div>
            )}
            {industryArray.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {industryArray.slice(0, 2).map((industry: any, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 text-xs px-1.5 py-0.5"
                  >
                    {String(industry)}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {displayTags.length > 0 && (
            <div className="pt-2 border-t border-gray-200">
              <div className="flex flex-wrap gap-0.5">
                {displayTags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-[10px] border-gray-300 text-gray-600 px-1 py-0.5">
                    {tag}
                  </Badge>
                ))}
                {remainingCount > 0 && (
                  <Badge variant="outline" className="text-[10px] border-gray-300 text-gray-600 px-1 py-0.5">
                    +{remainingCount}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}






