'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import type { CompanyDetail } from '@/lib/types/company-detail.types'

interface CompanyImageGalleryProps {
  company: CompanyDetail
}

export function CompanyImageGallery({ company }: CompanyImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const portfolioImages = company.company_images
    ?.filter((img) => img.image_type !== 'main')
    .sort((a, b) => a.display_order - b.display_order) || []

  if (portfolioImages.length === 0) {
    return null
  }

  return (
    <>
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">상세 이미지</h2>
        <div className="space-y-4">
          {portfolioImages.map((image, index) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image.image_url)}
              className="relative w-full max-w-full bg-gray-100 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
            >
              <div className="relative w-full" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <img
                  src={image.image_url}
                  alt={`${company.company_name} 상세 이미지 ${index + 1}`}
                  className="w-full h-auto object-contain"
                  style={{ display: 'block' }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-[1200px] p-0 max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">
            {company.company_name} 상세 이미지
          </DialogTitle>
          {selectedImage && (
            <div className="relative w-full bg-black flex items-center justify-center">
              <img
                src={selectedImage}
                alt={`${company.company_name} 상세 이미지`}
                className="w-full h-auto object-contain"
                style={{ display: 'block', maxWidth: '100%' }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

