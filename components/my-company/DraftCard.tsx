'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileEdit, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface DraftCardProps {
  onDelete: () => void
}

export function DraftCard({ onDelete }: DraftCardProps) {
  const router = useRouter()

  const handleContinue = () => {
    router.push('/companies/register')
  }

  const handleDeleteDraft = () => {
    localStorage.removeItem('company_draft')
    toast.success('임시 저장 데이터가 삭제되었습니다')
    onDelete()
  }

  return (
    <Card className="group relative p-5 hover:shadow-lg transition-all cursor-pointer bg-amber-50 border-amber-200">
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            handleDeleteDraft()
          }}
          className="bg-white shadow-sm hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </div>

      <div onClick={handleContinue} className="flex items-start gap-4">
        <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileEdit className="w-8 h-8 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-gray-900 font-semibold">임시 저장된 정보</h3>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs">
              작성 중
            </Badge>
          </div>
          <p className="text-sm text-gray-600">
            클릭하여 작성을 계속하세요
          </p>
        </div>
      </div>
    </Card>
  )
}


