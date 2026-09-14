import { zodResolver } from '@hookform/resolvers/zod'
import { useState, type ChangeEvent } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Card, CardHeader } from '../../../../components/ui/card'
import { useUpdateOrganizationSettings } from '../../hooks/use-update-organization-settings'
import { brandingSchema, type BrandingFormValues } from '../../schemas/organization-schemas'
import type { BrandingSettings } from '../../types/settings-types'
import { SettingsFormFooter } from '../settings-form-footer'

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function BrandingView({ branding }: { branding: BrandingSettings }) {
  const updateOrganizationSettings = useUpdateOrganizationSettings()
  const [logoError, setLogoError] = useState<string | null>(null)
  const { control, setValue, handleSubmit, register } = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingSchema),
    values: branding,
  })

  const logoDataUrl = useWatch({ control, name: 'logoDataUrl' })

  async function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setLogoError('Please choose an image file.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError('Logo files must be 2 MiB or smaller.')
      return
    }
    setLogoError(null)
    setValue('logoDataUrl', await readFileAsDataUrl(file), { shouldDirty: true })
  }

  const onSubmit = handleSubmit((values) => {
    updateOrganizationSettings.mutate({ branding: values })
  })

  return (
    <Card>
      <CardHeader title="Branding" description="Your logo is saved to your organization profile. Brand colors are not yet supported by the API." />
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-panel border border-line bg-canvas">
            {logoDataUrl ? (
              <img src={logoDataUrl} alt="Company logo" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs text-muted">Logo</span>
            )}
          </div>
          <div>
            <label htmlFor="logo" className="inline-block cursor-pointer text-sm font-medium text-accent hover:underline">
              {logoDataUrl ? 'Change logo' : 'Upload logo'}
            </label>
            <input id="logo" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
            {logoError ? <p className="mt-1 text-sm text-critical">{logoError}</p> : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="primaryColor" className="mb-1.5 block text-sm font-medium text-ink">
              Primary color
            </label>
            <div className="flex items-center gap-2">
              <input id="primaryColor" type="color" disabled className="h-9 w-12 rounded-lg border border-line bg-canvas disabled:cursor-not-allowed disabled:opacity-50" {...register('primaryColor')} />
              <span className="text-sm text-muted">Not yet saved by the API</span>
            </div>
          </div>
          <div>
            <label htmlFor="accentColor" className="mb-1.5 block text-sm font-medium text-ink">
              Accent color
            </label>
            <div className="flex items-center gap-2">
              <input id="accentColor" type="color" disabled className="h-9 w-12 rounded-lg border border-line bg-canvas disabled:cursor-not-allowed disabled:opacity-50" {...register('accentColor')} />
              <span className="text-sm text-muted">Not yet saved by the API</span>
            </div>
          </div>
        </div>

        <SettingsFormFooter isPending={updateOrganizationSettings.isPending} isSuccess={updateOrganizationSettings.isSuccess} />
      </form>
    </Card>
  )
}
