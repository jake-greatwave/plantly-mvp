'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
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
        <div className="overflow-hidden rounded-lg">
          {portfolioImages.map((image, index) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image.image_url)}
              className={`relative w-full aspect-video bg-gray-100 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ${
                index === 0 ? 'rounded-t-lg' : ''
              } ${
                index === portfolioImages.length - 1 ? 'rounded-b-lg' : ''
              }`}
            >
              <Image
                src={image.image_url}
                alt={`${company.company_name} 상세 이미지`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized
              />
            </div>
          ))}
        </div>
      </Card>
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0">
          {selectedImage && (
            <div className="relative w-full aspect-video bg-black">
              <Image
                src={selectedImage}
                alt={`${company.company_name} 상세 이미지`}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

