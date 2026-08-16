import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react'

type OtpInputProps = {
  length?: number
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  id?: string
}

export function OtpInput({ length = 6, value, onChange, error, disabled, id }: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const digits = Array.from({ length }, (_, i) => value[i] ?? '')

  function setDigit(index: number, digit: string) {
    const next = digits.slice()
    next[index] = digit
    onChange(next.join(''))
  }

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, '').slice(-1)
    setDigit(index, digit)
    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    event.preventDefault()
    onChange(pasted)
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus()
  }

  return (
    <div>
      <div id={id} className="flex justify-between gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el
            }}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-invalid={Boolean(error)}
            maxLength={1}
            className={`h-12 w-11 rounded-lg border bg-canvas text-center text-lg font-medium text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 ${
              error ? 'border-critical' : 'border-line focus:border-accent'
            }`}
          />
        ))}
      </div>
      {error ? (
        <p className="mt-1.5 text-sm text-critical" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
