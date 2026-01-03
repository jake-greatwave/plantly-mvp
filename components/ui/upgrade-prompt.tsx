'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UpgradeSurveyDialog } from './upgrade-survey-dialog'

interface UpgradePromptProps {
  feature: string
  upgradeSource?: string
  children?: React.ReactNode
  variant?: 'inline' | 'overlay'
  onUpgradeSuccess?: () => void
}

export function UpgradePrompt({ feature, upgradeSource, children, variant = 'inline', onUpgradeSuccess }: UpgradePromptProps) {
  const [surveyOpen, setSurveyOpen] = useState(false)

  const handleSurveySuccess = () => {
    onUpgradeSuccess?.()
  }

  if (variant === 'overlay') {
    return (
      <>
        <div className="relative">
          <div className="opacity-50 pointer-events-none select-none">{children}</div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-lg border-2 border-dashed border-gray-300 z-10">
            <Button
              type="button"
              variant="outline"
              className="gap-2 bg-white"
              onClick={() => setSurveyOpen(true)}
            >
              <Lock className="w-4 h-4" />
              업그레이드 필요
            </Button>
          </div>
        </div>
        <UpgradeSurveyDialog
          open={surveyOpen}
          onOpenChange={setSurveyOpen}
          feature={feature}
          upgradeSource={upgradeSource || feature}
          onSuccess={handleSurveySuccess}
        />
      </>
    )
  }

  return (
    <>
      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <div className="flex-1 text-sm text-amber-800">
          {feature} 기능은 Enterprise 등급에서 사용 가능합니다.
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="border-amber-300 text-amber-700 hover:bg-amber-100"
          onClick={() => setSurveyOpen(true)}
        >
          업그레이드
        </Button>
      </div>
      <UpgradeSurveyDialog
        open={surveyOpen}
        onOpenChange={setSurveyOpen}
        feature={feature}
        onSuccess={handleSurveySuccess}
      />
    </>
  )
}

