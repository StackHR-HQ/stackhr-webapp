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

// The company's own Anchor account. Payroll, reimbursements and salary
// advances are paid out of it, so it has to be funded first.
export interface DepositAccount {
  accountNumber: string
  accountName: string
  bankName: string
  // Whole naira (the API sends balanceKobo).
  balance: number
  currency: string
  status: string
  updatedAt: string
}

interface ApiDepositAccount {
  accountNumber: string
  accountName: string
  bankName: string
  balanceKobo: number
  currency: string
  status: string
  updatedAt: string
}

const toDepositAccount = (account: ApiDepositAccount): DepositAccount => ({
  accountNumber: account.accountNumber,
  accountName: account.accountName,
  bankName: account.bankName,
  balance: account.balanceKobo / 100,
  currency: account.currency,
  status: account.status,
  updatedAt: account.updatedAt,
})

export const bankingApi = {
  // The backend creates the account with Anchor the first time this is called.
  async getDepositAccount(): Promise<DepositAccount> {
    const { data } = await http.get<{ depositAccount: ApiDepositAccount }>('/banking/deposit-account')
    return toDepositAccount(data.depositAccount)
  },

  // Asks Anchor for the live balance; the GET returns the last synced one.
  async syncDepositAccount(): Promise<DepositAccount> {
    const { data } = await http.post<{ depositAccount: ApiDepositAccount }>('/banking/deposit-account/sync')
    return toDepositAccount(data.depositAccount)
  },

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
