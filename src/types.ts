export type Period = 'day' | 'week' | 'month'

export type Expense = {
  id: string
  /** Local calendar day in YYYY-MM-DD. */
  date: string
  amount: number
  category: string
  note: string
  createdAt: number
}

export type Settings = {
  currency: string
  locale: string
  monthlyBudget: number | null
}

export type Snapshot = {
  version: 1
  exportedAt: string
  settings: Settings
  expenses: Expense[]
}
