import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useEffect, type ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Button } from '../../../components/ui/button'
import { FormErrorBanner } from '../../../components/ui/form-error-banner'
import { SelectField } from '../../../components/ui/select-field'
import { TextField } from '../../../components/ui/text-field'
import { getApiErrorMessage } from '../../../lib/http'
import { notify } from '../../../lib/toast'
import { useBanks, useVerifyBankAccount } from '../../banking/hooks/use-banks'
import { usePfas } from '../../compliance/hooks/use-pension'
import { useUpdateMyProfile } from '../hooks/use-my-profile'
import { profileSchema, type ProfileFormValues } from '../schemas/profile-schema'
import type { MyProfile, ProfileUpdate } from '../types/employee-types'

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
]

const MARITAL_STATUS_OPTIONS = [
  { value: 'SINGLE', label: 'Single' },
  { value: 'MARRIED', label: 'Married' },
  { value: 'DIVORCED', label: 'Divorced' },
  { value: 'WIDOWED', label: 'Widowed' },
]

function toFormValues(profile: MyProfile): ProfileFormValues {
  return {
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    dateOfBirth: profile.dateOfBirth?.slice(0, 10) ?? '',
    gender: profile.gender ?? '',
    maritalStatus: profile.maritalStatus ?? '',
    nationality: profile.nationality ?? '',
    phone: profile.phone ?? '',
    personalEmail: profile.personalEmail ?? '',
    address: profile.address ?? '',
    emergencyContactName: profile.emergencyContactName ?? '',
    emergencyContactRelationship: profile.emergencyContactRelationship ?? '',
    emergencyContactPhone: profile.emergencyContactPhone ?? '',
    bankName: profile.bankName ?? '',
    accountNumber: profile.accountNumber ?? '',
    accountName: profile.accountName ?? '',
    tin: profile.tin ?? '',
    pensionProvider: profile.pensionProvider ?? '',
    pensionRsaNumber: profile.pensionRsaNumber ?? '',
  }
}

// What to show under the account number while it's being checked with the bank.
function verificationHint(
  verification: ReturnType<typeof useVerifyBankAccount>,
  bankName: string,
): { hint?: ReactNode; error?: string } {
  if (verification.isFetching) return { hint: 'Checking the account with your bank…' }
  if (verification.data) return { hint: `Verified: ${verification.data.accountName}` }
  if (verification.isError) {
    const status = isAxiosError(verification.error) ? verification.error.response?.status : undefined
    if (status === 404) return { error: `No account with this number at ${bankName}` }
    if (status === 400) return { error: getApiErrorMessage(verification.error) }
    // Anything else (e.g. no access to verification): don't block saving.
  }
  return {}
}

function FieldGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-5 first:border-t-0 first:pt-0">
      <h3 className="mb-4 text-sm font-medium text-ink">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}

export function EditProfileForm({ profile, onDone }: { profile: MyProfile; onDone: () => void }) {
  const updateProfile = useUpdateMyProfile()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: toFormValues(profile),
  })

  // Bank comes from Anchor's list when it loads; otherwise it stays free text.
  const banks = useBanks()
  const [bankName, accountNumber] = useWatch({ control, name: ['bankName', 'accountNumber'] })
  const bank = banks.data?.find((candidate) => candidate.name === bankName)
  const verification = useVerifyBankAccount(bank?.nipCode, accountNumber.trim())
  const verifiedName = verification.data?.accountName
  const bankOptions = banks.data
    ? [
        // Keep a saved bank that isn't on the list (e.g. typed before the list existed).
        ...(bankName && !bank ? [{ value: bankName, label: bankName }] : []),
        ...banks.data.map((candidate) => ({ value: candidate.name, label: candidate.name })),
      ]
    : []
  const accountHint = verificationHint(verification, bankName)

  // PFA comes from PenCom's official list when it loads, so pension schedules
  // can match it; otherwise it stays free text.
  const pfas = usePfas()
  const pensionProvider = useWatch({ control, name: 'pensionProvider' })
  const pfaOptions = pfas.data
    ? [
        ...(pensionProvider && !pfas.data.some((pfa) => pfa.name === pensionProvider)
          ? [{ value: pensionProvider, label: pensionProvider }]
          : []),
        ...pfas.data.map((pfa) => ({ value: pfa.name, label: pfa.name })),
      ]
    : []
  // Matched by name, so a saved provider gets its code even if it predates the list.
  const pfaCodeFor = (name: string) => pfas.data?.find((pfa) => pfa.name === name.trim())?.code ?? null

  // The bank's record of the holder's name wins over what was typed.
  useEffect(() => {
    if (verifiedName && getValues('accountName') !== verifiedName) {
      setValue('accountName', verifiedName, { shouldDirty: true, shouldValidate: true })
    }
  }, [verifiedName, getValues, setValue])

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    // Only send what changed; an emptied field clears the stored value.
    const update: ProfileUpdate = Object.fromEntries(
      (Object.keys(dirtyFields) as (keyof ProfileFormValues)[]).map((key) => [key, values[key].trim() || null]),
    )
    // Pension schedules check pfaCode, so keep it in step with the chosen PFA.
    // Without the list, a typed name can't be matched, so the code is left alone;
    // an unchanged provider only fills in a missing code, never clears one.
    if (pfas.data && (dirtyFields.pensionProvider || !profile.pfaCode)) {
      const pfaCode = pfaCodeFor(values.pensionProvider)
      if (pfaCode !== (profile.pfaCode ?? null)) update.pfaCode = pfaCode
    }
    if (Object.keys(update).length === 0) {
      onDone()
      return
    }
    try {
      await updateProfile.mutateAsync(update)
      notify.success('Profile updated')
      onDone()
    } catch (err) {
      setError('root', { message: getApiErrorMessage(err) })
    }
  })

  const field = (name: keyof ProfileFormValues) => ({ id: name, error: errors[name]?.message, ...register(name) })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {errors.root ? <FormErrorBanner message={errors.root.message ?? ''} /> : null}

      <FieldGroup title="Personal">
        <TextField label="First name" autoComplete="given-name" {...field('firstName')} />
        <TextField label="Last name" autoComplete="family-name" {...field('lastName')} />
        <TextField label="Date of birth" type="date" {...field('dateOfBirth')} />
        <SelectField label="Gender" placeholder="Select" options={GENDER_OPTIONS} {...field('gender')} />
        <SelectField
          label="Marital status"
          placeholder="Select"
          options={MARITAL_STATUS_OPTIONS}
          {...field('maritalStatus')}
        />
        <TextField label="Nationality" placeholder="Nigerian" {...field('nationality')} />
        <TextField label="Phone" type="tel" autoComplete="tel" placeholder="+2348012345678" {...field('phone')} />
        <TextField label="Personal email" type="email" autoComplete="email" {...field('personalEmail')} />
        <div className="sm:col-span-2">
          <TextField label="Address" autoComplete="street-address" {...field('address')} />
        </div>
      </FieldGroup>

      <FieldGroup title="Emergency contact">
        <TextField label="Full name" {...field('emergencyContactName')} />
        <TextField label="Relationship" placeholder="Spouse" {...field('emergencyContactRelationship')} />
        <TextField label="Phone" type="tel" {...field('emergencyContactPhone')} />
      </FieldGroup>

      <FieldGroup title="Bank details">
        {banks.data ? (
          <SelectField label="Bank" placeholder="Select your bank" options={bankOptions} {...field('bankName')} />
        ) : (
          <TextField label="Bank name" {...field('bankName')} />
        )}
        <TextField
          label="Account number"
          inputMode="numeric"
          maxLength={10}
          {...field('accountNumber')}
          error={errors.accountNumber?.message ?? accountHint.error}
          hint={accountHint.hint}
        />
        <div className="sm:col-span-2">
          <TextField label="Account name" {...field('accountName')} />
        </div>
      </FieldGroup>

      <FieldGroup title="Tax and pension">
        <TextField label="Tax ID (TIN)" {...field('tin')} />
        {pfas.data ? (
          <SelectField
            label="Pension provider (PFA)"
            options={[{ value: '', label: 'Not set' }, ...pfaOptions]}
            {...field('pensionProvider')}
          />
        ) : (
          <TextField label="Pension provider" {...field('pensionProvider')} />
        )}
        <TextField label="Pension RSA number" {...field('pensionRsaNumber')} />
      </FieldGroup>

      <div className="flex gap-3 border-t border-line pt-5">
        <Button type="button" variant="secondary" onClick={onDone} width="fit" className="px-6">
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} width="fit" className="px-6">
          Save changes
        </Button>
      </div>
    </form>
  )
}
