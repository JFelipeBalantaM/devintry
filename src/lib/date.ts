import type { Period } from '../types'

/** Calendar day key (YYYY-MM-DD) in the user's local time zone. */
export function toKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayKey(): string {
  return toKey(new Date())
}

export function isValidKey(key: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(key) && toKey(fromKey(key)) === key
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function startOfWeek(date: Date): Date {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  // ISO weeks start on Monday.
  const offset = (start.getDay() + 6) % 7
  return addDays(start, -offset)
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function startOfPeriod(date: Date, period: Period): Date {
  if (period === 'week') return startOfWeek(date)
  if (period === 'month') return startOfMonth(date)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/** Exclusive end of the period containing `date`. */
export function endOfPeriod(date: Date, period: Period): Date {
  const start = startOfPeriod(date, period)
  if (period === 'week') return addDays(start, 7)
  if (period === 'month') return new Date(start.getFullYear(), start.getMonth() + 1, 1)
  return addDays(start, 1)
}

export function shiftPeriod(date: Date, period: Period, steps: number): Date {
  const start = startOfPeriod(date, period)
  if (period === 'week') return addDays(start, steps * 7)
  if (period === 'month') return new Date(start.getFullYear(), start.getMonth() + steps, 1)
  return addDays(start, steps)
}

/** Number of days in the period, capped at today when the period is still running. */
export function elapsedDays(date: Date, period: Period): number {
  const start = startOfPeriod(date, period)
  const end = endOfPeriod(date, period)
  const today = startOfPeriod(new Date(), 'day')
  const last = today < end ? addDays(today, 1) : end
  const days = Math.round((last.getTime() - start.getTime()) / 86_400_000)
  return Math.max(1, days)
}

export function periodLabel(date: Date, period: Period, locale: string): string {
  const start = startOfPeriod(date, period)
  if (period === 'day') {
    const today = startOfPeriod(new Date(), 'day')
    const diff = Math.round((start.getTime() - today.getTime()) / 86_400_000)
    if (diff === 0) return 'Hoy'
    if (diff === -1) return 'Ayer'
    return capitalize(
      start.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' }),
    )
  }
  if (period === 'week') {
    const end = addDays(start, 6)
    const sameMonth = start.getMonth() === end.getMonth()
    const from = start.toLocaleDateString(locale, {
      day: 'numeric',
      month: sameMonth ? undefined : 'short',
    })
    const to = end.toLocaleDateString(locale, { day: 'numeric', month: 'short' })
    return `${from} – ${to}`
  }
  return capitalize(start.toLocaleDateString(locale, { month: 'long', year: 'numeric' }))
}

/** Short label used on chart axes. */
export function bucketLabel(date: Date, period: Period, locale: string): string {
  if (period === 'day') return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' })
  if (period === 'week') return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' })
  return capitalize(date.toLocaleDateString(locale, { month: 'short' }))
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
