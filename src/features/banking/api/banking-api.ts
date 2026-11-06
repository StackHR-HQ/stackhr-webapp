import { http } from '../../../lib/http'

export interface Bank {
  id: string
  name: string
  // NIP routing code; what account verification expects as bankCode.
  nipCode: string
  cbnCode: string
}

export interface VerifiedBankAccount {
  accountNumber: string
  accountName: string
  bankCode: string
  bankName: string
}

export const bankingApi = {
  async getBanks(): Promise<Bank[]> {
    const { data } = await http.get<{ banks: Bank[] }>('/banking/banks')
    return data.banks
  },

  // NIP name inquiry through Anchor: confirms the account exists and returns the holder's name.
  async verifyAccount(bankCode: string, accountNumber: string): Promise<VerifiedBankAccount> {
    const { data } = await http.post<{ account: VerifiedBankAccount }>('/banking/verify-account', {
      bankCode,
      accountNumber,
    })
    return data.account
  },
}
