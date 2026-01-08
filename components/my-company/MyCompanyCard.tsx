'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Building2, Eye, MapPin, Phone, Mail, Globe, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { formatFullAddress } from '@/lib/utils/address'
import { toast } from 'sonner'

interface MyCompanyCardProps {
  company: any
  onDelete?: () => void
}

export function MyCompanyCard({ company, onDelete }: MyCompanyCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const mainImage = company.company_images?.find((img: any) => img.image_type === 'main')?.image_url || null

  const categories = company.company_categories?.map((cc: any) => cc.categories?.category_name).filter(Boolean) || []
  const customTags = company.company_tags?.map((tag: any) => tag.tag_name) || []
  const allTags = [...categories, ...customTags]

  const handlePreview = () => {
    router.push(`/companies/${company.id}`)
  }

  const handleEdit = () => {
    router.push(`/companies/edit/${company.id}`)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await fetch(`/api/companies/${company.id}`, { method: 'DELETE' })
      toast.success('기업 정보가 삭제되었습니다')
      onDelete?.()
    } catch {
      toast.error('삭제 중 오류가 발생했습니다')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card 
      className="relative bg-white hover:shadow-lg transition-all overflow-hidden cursor-pointer"
      onClick={handlePreview}
    >
      <div className="flex flex-col h-full">
        <div className="relative h-80 bg-white overflow-hidden p-4">
          {mainImage ? (
            <img 
              src={mainImage} 
              alt={company.company_name} 
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded">
              <Building2 className="w-16 h-16 text-gray-400" />
            </div>
          )}
          <div className="absolute top-4 right-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white shadow-md hover:bg-red-50 text-red-600 border border-red-200"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  삭제
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>기업 정보 삭제</AlertDialogTitle>
                  <AlertDialogDescription>
                    정말로 이 기업 정보를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={(e) => e.stopPropagation()}>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={(e) => {
                    e.stopPropagation()
                    handleDelete()
                  }} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                    삭제
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {company.is_verified && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-blue-600 text-white text-sm px-3 py-1">
                인증 완료
              </Badge>
            </div>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="mb-3">
            <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
              {company.company_name}
            </h3>
            {company.intro_title && (
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {company.intro_title}
              </p>
            )}
          </div>

          <div className="space-y-1.5 mb-3 flex-1">
            {company.ceo_name && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">대표: {company.ceo_name}</span>
              </div>
            )}
            {company.address && (
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1">
                  {formatFullAddress(company.address, company.address_detail)}
                </span>
              </div>
            )}
            {company.manager_phone && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{company.manager_phone}</span>
              </div>
            )}
            {company.manager_email && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{company.manager_email}</span>
              </div>
            )}
            {company.website && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{company.website}</span>
              </div>
            )}
          </div>

          {allTags.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 3).map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {allTags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{allTags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-3 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                handlePreview()
              }}
              className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              상세보기
            </Button>
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                handleEdit()
              }}
              className="flex-1"
            >
              <Pencil className="w-4 h-4 mr-2" />
              수정하기
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

