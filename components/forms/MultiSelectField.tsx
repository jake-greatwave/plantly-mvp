'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

type Option = string | { value: string; label: string }

interface MultiSelectFieldProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  columns?: number
}

export function MultiSelectField({ options, value, onChange, columns = 2 }: MultiSelectFieldProps) {
  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const getOptionValue = (option: Option): string => {
    return typeof option === 'string' ? option : option.value
  }

  const getOptionLabel = (option: Option): string => {
    return typeof option === 'string' ? option : option.label
  }

  return (
    <div className={`grid grid-cols-${columns} md:grid-cols-${Math.min(columns * 2, 4)} gap-3`}>
      {options.map((option) => {
        const optionValue = getOptionValue(option)
        const optionLabel = getOptionLabel(option)
        
        return (
          <div key={optionValue} className="flex items-center space-x-2">
            <Checkbox
              id={`option-${optionValue}`}
              checked={value.includes(optionValue)}
              onCheckedChange={() => toggleOption(optionValue)}
            />
            <Label
              htmlFor={`option-${optionValue}`}
              className="text-sm font-normal cursor-pointer"
            >
              {optionLabel}
            </Label>
          </div>
        )
      })}
    </div>
  )
}

