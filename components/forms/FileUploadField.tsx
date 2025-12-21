'use client'

import { useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { uploadMultipleFiles } from '@/lib/utils/upload'
import { toast } from 'sonner'

interface FileUploadFieldProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
  accept?: string
}

export function FileUploadField({ value, onChange, maxFiles = 10, accept = 'image/*' }: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length + value.length > maxFiles) {
      toast.error(`최대 ${maxFiles}개까지 업로드 가능합니다.`)
      return
    }

    setUploading(true)
    try {
      const urls = await uploadMultipleFiles(files)
      onChange([...value, ...urls])
      toast.success('파일 업로드 완료')
    } catch {
      toast.error('파일 업로드 실패')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (url: string) => {
    onChange(value.filter(u => u !== url))
  }

  return (
    <div className="space-y-3">
      <div>
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('file-upload')?.click()}
          disabled={uploading || value.length >= maxFiles}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              업로드 중...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              파일 선택 ({value.length}/{maxFiles})
            </>
          )}
        </Button>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => removeFile(url)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

