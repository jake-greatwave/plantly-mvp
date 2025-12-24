'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

type Option = string | { value: string; label: string }

interface MultiSelectFieldProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  columns?: number
  disabled?: boolean
  disabledOptions?: string[]
  maxSelections?: number
}

export function MultiSelectField({ 
  options, 
  value, 
  onChange, 
  columns = 2,
  disabled = false,
  disabledOptions = [],
  maxSelections
}: MultiSelectFieldProps) {
  const toggleOption = (optionValue: string) => {
    if (disabled) return
    if (disabledOptions.includes(optionValue)) return
    
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue))
    } else {
      if (maxSelections && value.length >= maxSelections) return
      onChange([...value, optionValue])
    }
  }

  const getOptionValue = (option: Option): string => {
    return typeof option === 'string' ? option : option.value
  }

  const getOptionLabel = (option: Option): string => {
    return typeof option === 'string' ? option : option.label
  }

  const isOptionDisabled = (optionValue: string): boolean => {
    if (disabled) return true
    if (disabledOptions.includes(optionValue)) return true
    if (maxSelections && !value.includes(optionValue) && value.length >= maxSelections) return true
    return false
  }

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-2'

  return (
    <div className={`grid ${gridColsClass} gap-3`}>
      {options.map((option) => {
        const optionValue = getOptionValue(option)
        const optionLabel = getOptionLabel(option)
        const optionDisabled = isOptionDisabled(optionValue)
        
        return (
          <div key={optionValue} className="flex items-center space-x-2">
            <Checkbox
              id={`option-${optionValue}`}
              checked={value.includes(optionValue)}
              onCheckedChange={() => toggleOption(optionValue)}
              disabled={optionDisabled}
            />
            <Label
              htmlFor={`option-${optionValue}`}
              className={`text-sm font-normal ${optionDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              {optionLabel}
            </Label>
          </div>
        )
      })}
    </div>
  )
}




