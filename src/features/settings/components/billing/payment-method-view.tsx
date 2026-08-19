import { CreditCardIcon } from '@phosphor-icons/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Card, CardHeader } from '../../../../components/ui/card'
import { SelectField } from '../../../../components/ui/select-field'
import { TextField } from '../../../../components/ui/text-field'
import { useUpdatePaymentMethod } from '../../hooks/use-update-payment-method'
import { paymentMethodSchema, type PaymentMethodFormValues } from '../../schemas/billing-schemas'
import type { PaymentMethod } from '../../types/settings-types'
import { SettingsFormFooter } from '../settings-form-footer'

const CARD_BRANDS = ['Visa', 'Mastercard', 'Verve'] as const

export function PaymentMethodView({ paymentMethod }: { paymentMethod: PaymentMethod }) {
  const updatePaymentMethod = useUpdatePaymentMethod()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    values: paymentMethod,
  })

  const onSubmit = handleSubmit((values) => {
    updatePaymentMethod.mutate(values)
  })

  return (
    <Card>
      <CardHeader title="Payment Method" description="The card used to pay for your StackHR subscription." />

      <div className="mb-5 flex items-center gap-3 rounded-lg border border-line p-4">
        <CreditCardIcon className="h-8 w-8 text-muted" />
        <div>
          <p className="text-sm font-medium text-ink">
            {paymentMethod.brand} •••• {paymentMethod.last4}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            Expires {String(paymentMethod.expiryMonth).padStart(2, '0')}/{paymentMethod.expiryYear} · {paymentMethod.cardholderName}
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <TextField
          id="cardholderName"
          label="Cardholder name"
          placeholder="Demo Admin"
          error={errors.cardholderName?.message}
          {...register('cardholderName')}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectField
            id="brand"
            label="Card brand"
            options={CARD_BRANDS.map((brand) => ({ value: brand, label: brand }))}
            error={errors.brand?.message}
            {...register('brand')}
          />
          <TextField id="last4" label="Last 4 digits" placeholder="4242" maxLength={4} error={errors.last4?.message} {...register('last4')} />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:w-1/2">
          <TextField
            id="expiryMonth"
            label="Expiry month"
            type="number"
            min={1}
            max={12}
            placeholder="11"
            error={errors.expiryMonth?.message}
            {...register('expiryMonth', { valueAsNumber: true })}
          />
          <TextField
            id="expiryYear"
            label="Expiry year"
            type="number"
            placeholder="2028"
            error={errors.expiryYear?.message}
            {...register('expiryYear', { valueAsNumber: true })}
          />
        </div>

        <SettingsFormFooter isPending={updatePaymentMethod.isPending} isSuccess={updatePaymentMethod.isSuccess} />
      </form>
    </Card>
  )
}
