import type { Settings } from '../types'

export function formatMoney(amount: number, settings: Settings): string {
  return new Intl.NumberFormat(settings.locale, {
    style: 'currency',
    currency: settings.currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}

/** Compact form for chart axes, e.g. 1,2 M. */
export function formatCompact(amount: number, settings: Settings): string {
  return new Intl.NumberFormat(settings.locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount)
}

export function formatPercent(ratio: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(ratio)
}
