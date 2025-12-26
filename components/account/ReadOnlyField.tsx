import { Label } from '@/components/ui/label'

interface ReadOnlyFieldProps {
  label: string
  value: string | null | undefined
  className?: string
}

export function ReadOnlyField({ label, value, className = '' }: ReadOnlyFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-gray-900 text-sm">{label}</Label>
      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm">
        {value || '-'}
      </div>
    </div>
  )
}

