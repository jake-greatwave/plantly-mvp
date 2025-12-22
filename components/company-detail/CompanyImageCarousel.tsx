"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageViewer } from "./ImageViewer";

interface ImageItem {
  id: string;
  image_url: string;
  image_type: "main" | "portfolio" | "facility" | null;
  display_order: number;
}

interface CompanyImageCarouselProps {
  images: ImageItem[];
}

export function CompanyImageCarousel({ images }: CompanyImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;

    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images.length, isPaused]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <ImageViewer
        images={images}
        initialIndex={currentIndex}
        trigger={
          <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden cursor-pointer group">
            <div className="relative w-full h-full overflow-hidden">
              <div
                className="flex h-full transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${(currentIndex * 100) / images.length}%)`,
                  width: `${images.length * 100}%`,
                }}
              >
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className="relative flex-shrink-0 h-full flex items-center justify-center bg-gray-100"
                    style={{ width: `${100 / images.length}%` }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={image.image_url}
                        alt={`포트폴리오 이미지 ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized
                        loading="eager"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full shadow-lg z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full shadow-lg z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      goToSlide(index);
                    }}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      index === currentIndex
                        ? "bg-white w-8"
                        : "bg-white/50 hover:bg-white/75"
                    )}
                    aria-label={`이미지 ${index + 1}로 이동`}
                  />
                ))}
              </div>
            )}
          </div>
        }
      />

      {images.length > 1 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

