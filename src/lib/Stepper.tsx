import { Minus, Plus } from 'lucide-react'
import { Button } from './Button'

type StepperProps = {
  label: string
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
}

export function Stepper({ label, max = 99, min = 0, onChange, value }: StepperProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-semibold">{label}</span>
      <div className="grid grid-cols-[2.5rem_2.5rem_2.5rem] items-center overflow-hidden rounded-md border border-border bg-card">
        <Button
          aria-label={`Decrease ${label}`}
          className="rounded-none border-r border-border"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          size="icon"
          type="button"
          variant="ghost"
        >
          <Minus aria-hidden="true" className="h-4 w-4" />
        </Button>
        <span className="text-center text-sm font-semibold">{value}</span>
        <Button
          aria-label={`Increase ${label}`}
          className="rounded-none border-l border-border"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          size="icon"
          type="button"
          variant="ghost"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
