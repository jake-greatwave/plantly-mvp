'use client'

import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface UpgradePromptProps {
  feature: string
  children?: React.ReactNode
  variant?: 'inline' | 'overlay'
}

export function UpgradePrompt({ feature, children, variant = 'inline' }: UpgradePromptProps) {
  const handleUpgrade = () => {
    window.location.href = '/upgrade'
  }

  if (variant === 'overlay') {
    return (
      <div className="relative">
        <div className="opacity-50 pointer-events-none select-none">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-lg border-2 border-dashed border-gray-300 z-10">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-white">
                <Lock className="w-4 h-4" />
                업그레이드 필요
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>업그레이드가 필요합니다</DialogTitle>
                <DialogDescription>
                  {feature} 기능을 사용하려면 Enterprise 등급으로 업그레이드해주세요.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={handleUpgrade} className="bg-blue-600 hover:bg-blue-700">
                  업그레이드하기
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
      <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
      <div className="flex-1 text-sm text-amber-800">
        {feature} 기능은 Enterprise 등급에서 사용 가능합니다.
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
            업그레이드
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>업그레이드가 필요합니다</DialogTitle>
            <DialogDescription>
              {feature} 기능을 사용하려면 Enterprise 등급으로 업그레이드해주세요.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleUpgrade} className="bg-blue-600 hover:bg-blue-700">
              업그레이드하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

