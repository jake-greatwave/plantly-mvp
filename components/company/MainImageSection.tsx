'use client'

import { useState } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { uploadFile } from '@/lib/utils/upload'
import { toast } from 'sonner'
import type { CompanyFormData } from '@/lib/types/company-form.types'

interface MainImageSectionProps {
  data: Partial<CompanyFormData>
  onFieldChange: (field: keyof CompanyFormData, value: any) => void
}

export function MainImageSection({ data, onFieldChange }: MainImageSectionProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    setUploading(true)
    try {
      const url = await uploadFile(file)
      if (url) {
        onFieldChange('main_image', url)
        toast.success('대표 이미지가 업로드되었습니다')
      } else {
        toast.error('이미지 업로드에 실패했습니다')
      }
    } catch {
      toast.error('이미지 업로드 중 오류가 발생했습니다')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const removeImage = () => {
    onFieldChange('main_image', '')
  }

  return (
    <div className="space-y-3">
      <div>
        <Label>
          대표 이미지 <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-gray-500 mt-1">
          기업을 대표하는 이미지를 등록해주세요 (권장: 1200x800px 이상)
        </p>
      </div>

      {data.main_image ? (
        <div className="relative group">
          <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={data.main_image}
              alt="대표 이미지"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={removeImage}
            className="absolute top-2 right-2 opacity-90 hover:opacity-100"
          >
            <X className="w-4 h-4 mr-1" />
            삭제
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="main-image-upload"
            disabled={uploading}
          />
          <label
            htmlFor="main-image-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            {uploading ? (
              <>
                <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-2" />
                <span className="text-sm text-gray-600">업로드 중...</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-700 mb-1">
                  이미지 선택
                </span>
                <span className="text-xs text-gray-500">
                  JPG, PNG, GIF (최대 5MB)
                </span>
              </>
            )}
          </label>
        </div>
      )}

      {!data.main_image && (
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('main-image-upload')?.click()}
          disabled={uploading}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          이미지 업로드
        </Button>
      )}
    </div>
  )
}




