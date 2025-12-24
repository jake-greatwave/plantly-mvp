'use client'

import { Input } from '@/components/ui/input'
import { Lock } from 'lucide-react'

interface ColorPickerFieldProps {
  value: string
  onChange: (color: string) => void
  disabled?: boolean
  allowedColors?: string[]
}

const PRESET_COLORS = [
  '#3B82F6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#6B7280',
]

const BASIC_COLOR = '#6B7280'

export function ColorPickerField({ value, onChange, disabled = false, allowedColors }: ColorPickerFieldProps) {
  const availableColors = allowedColors || PRESET_COLORS
  const isLimited = allowedColors && allowedColors.length === 1

  const handleColorChange = (color: string) => {
    if (disabled) return
    if (allowedColors && !allowedColors.includes(color)) return
    onChange(color)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => handleColorChange(e.target.value)}
            disabled={disabled || isLimited}
            className={`w-20 h-10 rounded border border-gray-300 ${disabled || isLimited ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          />
          {isLimited && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded">
              <Lock className="w-4 h-4 text-gray-400" />
            </div>
          )}
        </div>
        <Input
          type="text"
          value={value}
          onChange={(e) => handleColorChange(e.target.value)}
          placeholder="#000000"
          className="flex-1"
          disabled={disabled || isLimited}
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {availableColors.map((color) => {
          const isSelected = value === color
          const isDisabled = disabled || (allowedColors && !allowedColors.includes(color))
          
          return (
            <button
              key={color}
              type="button"
              onClick={() => handleColorChange(color)}
              disabled={isDisabled}
              className={`w-8 h-8 rounded border-2 transition-transform relative ${
                isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:scale-110 cursor-pointer'
              }`}
              style={{ 
                backgroundColor: color,
                borderColor: isSelected ? '#000' : '#E5E7EB'
              }}
              title={color}
            >
              {isLimited && color === allowedColors[0] && (
                <Lock className="w-3 h-3 text-white absolute inset-0 m-auto drop-shadow-md" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}




