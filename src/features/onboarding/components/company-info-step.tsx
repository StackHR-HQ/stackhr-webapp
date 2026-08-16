import { zodResolver } from '@hookform/resolvers/zod'
import { useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/ui/button'
import { SelectField } from '../../../components/ui/select-field'
import { TextField } from '../../../components/ui/text-field'
import { COMPANY_SIZES, CURRENCIES, INDUSTRIES, PAYROLL_FREQUENCIES } from '../constants/onboarding-options'
import { companyInfoSchema, type CompanyInfoFormValues } from '../schemas/company-info-schema'

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function CompanyInfoStep({
  defaultValues,
  onNext,
  onBack,
}: {
  defaultValues: CompanyInfoFormValues | null
  onNext: (values: CompanyInfoFormValues) => void
  onBack: () => void
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CompanyInfoFormValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: defaultValues ?? {
      name: '',
      logoDataUrl: undefined,
      industry: '',
      companySize: '',
      taxId: '',
      currency: 'NGN',
      payrollFrequency: 'Monthly',
    },
  })

  const logoDataUrl = watch('logoDataUrl')
  const [logoError, setLogoError] = useState<string | null>(null)

  async function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setLogoError('Please choose an image file.')
      return
    }
    setLogoError(null)
    setValue('logoDataUrl', await readFileAsDataUrl(file))
  }

  const onSubmit = handleSubmit((values) => onNext(values))

  return (
    <div>
      <h1 className="text-2xl font-medium text-ink">Company info</h1>
      <p className="mt-1 text-sm text-muted">This helps us tailor payroll and compliance to your business.</p>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-panel border border-line bg-surface">
            {logoDataUrl ? (
              <img src={logoDataUrl} alt="Company logo" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs text-muted">Logo</span>
            )}
          </div>
          <div>
            <label htmlFor="logo" className="inline-block cursor-pointer text-sm font-medium text-accent hover:underline">
              {logoDataUrl ? 'Change logo' : 'Upload logo (optional)'}
            </label>
            <input id="logo" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
            {logoError ? <p className="mt-1 text-sm text-critical">{logoError}</p> : null}
          </div>
        </div>

        <TextField
          id="name"
          label="Company name"
          placeholder="Acme Inc."
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            id="industry"
            label="Industry"
            placeholder="Select industry"
            options={INDUSTRIES.map((industry) => ({ value: industry, label: industry }))}
            error={errors.industry?.message}
            {...register('industry')}
          />
          <SelectField
            id="companySize"
            label="Company size"
            placeholder="Select size"
            options={COMPANY_SIZES.map((size) => ({ value: size, label: `${size} employees` }))}
            error={errors.companySize?.message}
            {...register('companySize')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            id="currency"
            label="Currency"
            options={CURRENCIES.map((currency) => ({ value: currency.code, label: `${currency.code} — ${currency.label}` }))}
            {...register('currency')}
          />
          <SelectField
            id="payrollFrequency"
            label="Payroll frequency"
            options={PAYROLL_FREQUENCIES.map((frequency) => ({ value: frequency, label: frequency }))}
            {...register('payrollFrequency')}
          />
        </div>

        <TextField
          id="taxId"
          label={
            <span>
              Tax ID <span className="font-normal text-muted">(optional — add later if you don&apos;t have it yet)</span>
            </span>
          }
          placeholder="e.g. TIN 12345678-0001"
          error={errors.taxId?.message}
          {...register('taxId')}
        />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onBack} className="w-auto px-6">
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Continue
          </Button>
        </div>
      </form>
    </div>
  )
}
