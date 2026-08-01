import { useCallback, useEffect, useState } from 'react'
import type { Expense, Settings, Snapshot } from './types'
import {
  DEFAULT_SETTINGS,
  loadExpenses,
  loadSettings,
  saveExpenses,
  saveSettings,
} from './lib/storage'

export type ExpenseDraft = Omit<Expense, 'id' | 'createdAt'>

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(loadExpenses)
  const [settings, setSettings] = useState<Settings>(loadSettings)

  useEffect(() => {
    saveExpenses(expenses)
  }, [expenses])

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const add = useCallback((draft: ExpenseDraft) => {
    setExpenses((current) => [
      { ...draft, id: crypto.randomUUID(), createdAt: Date.now() },
      ...current,
    ])
  }, [])

  const update = useCallback((id: string, draft: ExpenseDraft) => {
    setExpenses((current) =>
      current.map((expense) => (expense.id === id ? { ...expense, ...draft } : expense)),
    )
  }, [])

  const remove = useCallback((id: string) => {
    setExpenses((current) => current.filter((expense) => expense.id !== id))
  }, [])

  const clear = useCallback(() => {
    setExpenses([])
    setSettings(DEFAULT_SETTINGS)
  }, [])

  const restore = useCallback((snapshot: Snapshot, mode: 'replace' | 'merge') => {
    setSettings(snapshot.settings)
    setExpenses((current) => {
      if (mode === 'replace') return snapshot.expenses
      const seen = new Set(current.map((expense) => expense.id))
      return [...current, ...snapshot.expenses.filter((expense) => !seen.has(expense.id))]
    })
  }, [])

  return { expenses, settings, setSettings, add, update, remove, clear, restore }
}
