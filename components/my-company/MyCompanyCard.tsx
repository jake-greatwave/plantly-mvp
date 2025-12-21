'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Building2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

interface MyCompanyCardProps {
  id: string
  name: string
  logoUrl?: string | null
  introTitle?: string | null
  isVerified?: boolean
  onDelete?: () => void
}

export function MyCompanyCard({ id, name, logoUrl, introTitle, isVerified, onDelete }: MyCompanyCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = () => {
    router.push(`/companies/edit/${id}`)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await fetch(`/api/companies/${id}`, { method: 'DELETE' })
      toast.success('기업 정보가 삭제되었습니다')
      onDelete?.()
    } catch {
      toast.error('삭제 중 오류가 발생했습니다')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="group relative p-5 hover:shadow-lg transition-all cursor-pointer bg-white">
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            handleEdit()
          }}
          className="bg-white shadow-sm hover:bg-blue-50"
        >
          <Pencil className="w-4 h-4 text-blue-600" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={(e) => e.stopPropagation()}
              className="bg-white shadow-sm hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>기업 정보 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                정말로 이 기업 정보를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
          {logoUrl ? (
            <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-gray-900 font-semibold truncate">{name}</h3>
            {isVerified && (
              <Badge variant="secondary" className="bg-blue-50 text-blue-600 text-xs">
                인증
              </Badge>
            )}
          </div>
          {introTitle && (
            <p className="text-sm text-gray-600 line-clamp-2">{introTitle}</p>
          )}
        </div>
      </div>
    </Card>
  )
}

