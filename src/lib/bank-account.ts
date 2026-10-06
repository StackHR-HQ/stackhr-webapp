// The backend doesn't always fill bankAccountLast4 after an account number is saved,
// so fall back to the last four digits of the full number.
export function maskedAccountNumber(last4?: string | null, accountNumber?: string | null): string | null {
  const digits = last4 || accountNumber?.slice(-4)
  return digits ? `•••• ${digits}` : null
}
