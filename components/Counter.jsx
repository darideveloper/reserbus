
import { useState, useEffect } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'


/**
 * 
 * Counter with plus and minus buttons 
 * 
 * @param {object} props
 * @param {string} props.title - Counter title
 * @param {number} props.value - Counter value
 * @param {function} props.setValue - Function to set the counter value
 * @param {number} props.minValue - Minimum value for the counter
 * @param {string} props.className - Extra classes
 * @param {boolean} props.inputEditable - If the input is editable
 * @returns 
 */
export default function Counter({
  title,
  value,
  setValue,
  minValue = 0,
  className,
  inputEditable = false
}) {

  const [isMinValue, setIsMinValue] = useState(false)
  useEffect(() => {
    setIsMinValue(value === minValue)
  }, [value])


  return (
    <div
      className={`
        space-y-2 
        flex
        flex-col
        items-center
        justify-between
        gap-1
        ${className}
      `}
    >
      <Label>{title}</Label>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (!isMinValue) {
              setValue(Math.max(0, value - 1))
            }
          }}
          aria-label="Disminuir adultos"
          type="button"
          disabled={isMinValue}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <input
          className={`w-8 text-center ${!inputEditable && 'focus:outline-none'}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          readOnly={!inputEditable}
          type="number"
          min={minValue}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setValue(value + 1)}
          aria-label="Aumentar adultos"
          type="button"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
