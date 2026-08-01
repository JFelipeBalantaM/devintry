import type { Expense, Period } from '../types'
import { bucketLabel, endOfPeriod, shiftPeriod, startOfPeriod, toKey } from './date'

export type Bucket = {
  key: string
  label: string
  total: number
  current: boolean
}

export type CategoryTotal = {
  category: string
  total: number
  share: number
}

export function inPeriod(expenses: Expense[], anchor: Date, period: Period): Expense[] {
  const start = toKey(startOfPeriod(anchor, period))
  const end = toKey(endOfPeriod(anchor, period))
  return expenses.filter((expense) => expense.date >= start && expense.date < end)
}

export function sum(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => total + expense.amount, 0)
}

export function byCategory(expenses: Expense[]): CategoryTotal[] {
  const totals = new Map<string, number>()
  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount)
  }
  const overall = sum(expenses)
  return [...totals.entries()]
    .map(([category, total]) => ({ category, total, share: overall > 0 ? total / overall : 0 }))
    .sort((a, b) => b.total - a.total)
}

/** Totals for the `count` periods ending with the one containing `anchor`. */
export function trend(
  expenses: Expense[],
  anchor: Date,
  period: Period,
  count: number,
  locale: string,
): Bucket[] {
  const buckets: Bucket[] = []
  for (let offset = count - 1; offset >= 0; offset--) {
    const start = shiftPeriod(anchor, period, -offset)
    buckets.push({
      key: toKey(start),
      label: bucketLabel(start, period, locale),
      total: sum(inPeriod(expenses, start, period)),
      current: offset === 0,
    })
  }
  return buckets
}

export function groupByDay(expenses: Expense[]): { date: string; items: Expense[]; total: number }[] {
  const groups = new Map<string, Expense[]>()
  for (const expense of expenses) {
    const items = groups.get(expense.date)
    if (items) items.push(expense)
    else groups.set(expense.date, [expense])
  }
  return [...groups.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, items]) => ({
      date,
      items: items.sort((a, b) => b.createdAt - a.createdAt),
      total: sum(items),
    }))
}

export function dailyAverage(expenses: Expense[], days: number): number {
  return days > 0 ? sum(expenses) / days : 0
}

export function previousPeriodTotal(expenses: Expense[], anchor: Date, period: Period): number {
  return sum(inPeriod(expenses, shiftPeriod(anchor, period, -1), period))
}
