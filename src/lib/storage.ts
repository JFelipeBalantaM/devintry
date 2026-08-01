import type { Expense, Settings, Snapshot } from '../types'
import { isValidKey } from './date'

const EXPENSES_KEY = 'gastos:expenses:v1'
const SETTINGS_KEY = 'gastos:settings:v1'

export const DEFAULT_SETTINGS: Settings = {
  currency: 'COP',
  locale: 'es-CO',
  monthlyBudget: null,
}

export function loadExpenses(): Expense[] {
  return parseExpenses(read(EXPENSES_KEY))
}

export function saveExpenses(expenses: Expense[]): void {
  write(EXPENSES_KEY, expenses)
}

export function loadSettings(): Settings {
  return parseSettings(read(SETTINGS_KEY))
}

export function saveSettings(settings: Settings): void {
  write(SETTINGS_KEY, settings)
}

export function parseSnapshot(raw: string): Snapshot {
  const data: unknown = JSON.parse(raw)
  if (typeof data !== 'object' || data === null) throw new Error('El archivo no es un respaldo válido.')
  const record = data as Record<string, unknown>
  const expenses = parseExpenses(record.expenses)
  if (expenses.length === 0 && !Array.isArray(record.expenses)) {
    throw new Error('El archivo no contiene gastos.')
  }
  return {
    version: 1,
    exportedAt: typeof record.exportedAt === 'string' ? record.exportedAt : new Date().toISOString(),
    settings: parseSettings(record.settings),
    expenses,
  }
}

function read(key: string): unknown {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? null : JSON.parse(raw)
  } catch {
    return null
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be full or blocked (private mode); the in-memory state still works.
  }
}

function parseExpenses(data: unknown): Expense[] {
  if (!Array.isArray(data)) return []
  const expenses: Expense[] = []
  for (const item of data) {
    if (typeof item !== 'object' || item === null) continue
    const record = item as Record<string, unknown>
    const amount = Number(record.amount)
    const date = typeof record.date === 'string' ? record.date : ''
    if (!Number.isFinite(amount) || amount <= 0 || !isValidKey(date)) continue
    expenses.push({
      id: typeof record.id === 'string' ? record.id : crypto.randomUUID(),
      date,
      amount,
      category: typeof record.category === 'string' && record.category ? record.category : 'Otros',
      note: typeof record.note === 'string' ? record.note : '',
      createdAt: Number.isFinite(Number(record.createdAt)) ? Number(record.createdAt) : Date.now(),
    })
  }
  return expenses
}

function parseSettings(data: unknown): Settings {
  if (typeof data !== 'object' || data === null) return DEFAULT_SETTINGS
  const record = data as Record<string, unknown>
  const budget = Number(record.monthlyBudget)
  return {
    currency:
      typeof record.currency === 'string' && /^[A-Z]{3}$/.test(record.currency)
        ? record.currency
        : DEFAULT_SETTINGS.currency,
    locale: typeof record.locale === 'string' && record.locale ? record.locale : DEFAULT_SETTINGS.locale,
    monthlyBudget: Number.isFinite(budget) && budget > 0 ? budget : null,
  }
}
