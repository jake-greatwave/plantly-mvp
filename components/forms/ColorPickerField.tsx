'use client'

import { Input } from '@/components/ui/input'

interface ColorPickerFieldProps {
  value: string
  onChange: (color: string) => void
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

export function ColorPickerField({ value, onChange }: ColorPickerFieldProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-20 h-10 rounded cursor-pointer border border-gray-300"
          />
        </div>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
      </div>

      <div className="flex gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
            style={{ 
              backgroundColor: color,
              borderColor: value === color ? '#000' : '#E5E7EB'
            }}
            title={color}
          />
        ))}
      </div>
    </div>
  )
}

