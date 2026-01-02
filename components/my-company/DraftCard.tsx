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
    <Card 
      className="relative bg-amber-50 border-amber-200 hover:shadow-lg transition-all overflow-hidden cursor-pointer"
      onClick={handleContinue}
    >
      <div className="flex flex-col h-full">
        <div className="relative h-80 bg-amber-100 overflow-hidden flex items-center justify-center">
          <FileEdit className="w-20 h-20 text-amber-600" />
          <div className="absolute top-4 right-4">
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteDraft()
              }}
              className="bg-white shadow-md hover:bg-red-50 text-red-600 border border-red-200"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              삭제
            </Button>
          </div>
          <div className="absolute top-4 left-4">
            <Badge className="bg-amber-600 text-white text-sm px-3 py-1">
              작성 중
            </Badge>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="mb-3">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              임시 저장된 정보
            </h3>
            <p className="text-gray-600 text-sm">
              작성 중인 기업 정보가 임시 저장되어 있습니다
            </p>
          </div>

          <div className="flex gap-2 pt-3 border-t border-amber-200 mt-auto">
            <Button
              onClick={handleContinue}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
            >
              <FileEdit className="w-4 h-4 mr-2" />
              작성 계속하기
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}






