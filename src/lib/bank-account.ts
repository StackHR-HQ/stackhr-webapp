export function maskedAccountNumber(last4?: string | null): string | null {
  return last4 ? `•••• ${last4}` : null
}
