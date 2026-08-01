import type { Expense } from '../types'

const HEADERS = ['fecha', 'monto', 'categoria', 'nota']

export function toCsv(expenses: Expense[]): string {
  const rows = expenses.map((expense) =>
    [expense.date, String(expense.amount), expense.category, expense.note].map(escapeCell).join(','),
  )
  return [HEADERS.join(','), ...rows].join('\n')
}

export function download(filename: string, contents: string, mime: string): void {
  const url = URL.createObjectURL(new Blob([contents], { type: `${mime};charset=utf-8` }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function escapeCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value
}
