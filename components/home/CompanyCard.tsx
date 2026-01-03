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

  const displayTags = tags.length > 0 
    ? tags.slice(0, 3).map(t => `#${t.tag_name}`)
    : categories.slice(0, 3).map(c => c.categories?.category_name).filter(Boolean).map(name => `#${name}`)

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
        <div className="relative w-40 h-40 flex-shrink-0 bg-gray-100 overflow-hidden">
          {imageToShow ? (
            <img 
              src={imageToShow} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
          )}
          {isFeatured && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-yellow-500 text-white text-sm px-2 py-1">
                <Star className="w-3 h-3 mr-1" />
                추천
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col min-w-0">
          <h3 className="text-base font-semibold text-gray-900 mb-1.5 line-clamp-1">
            {name}
          </h3>

          {description && (
            <p className="text-gray-700 text-sm mb-2.5 line-clamp-2">
              {description}
            </p>
          )}

          <div className="space-y-1.5 mb-2.5 flex-1">
            {ceoName && (
              <p className="text-sm text-gray-600">
                대표: {ceoName}
              </p>
            )}
            {location && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="line-clamp-1">{formatAddressShort(location)}</span>
              </div>
            )}
            {industryArray.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {industryArray.slice(0, 2).map((industry: any, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 text-sm px-2 py-0.5"
                  >
                    {String(industry)}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {displayTags.length > 0 && (
            <div className="pt-2.5 border-t border-gray-200">
              <div className="flex flex-wrap gap-1.5">
                {displayTags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-sm border-gray-300 text-gray-600 px-2 py-0.5">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}






