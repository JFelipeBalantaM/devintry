import { useEffect, useState } from 'react'
import type { Expense } from '../types'
import type { ExpenseDraft } from '../useExpenses'
import { CATEGORIES } from '../lib/categories'
import { todayKey } from '../lib/date'

const INPUT =
  'w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-neutral-700 dark:bg-neutral-950'

const LABEL = 'mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400'

type ExpenseFormProps = {
  editing: Expense | null
  defaultDate: string
  onSubmit: (draft: ExpenseDraft) => void
  onCancelEdit: () => void
}

export function ExpenseForm({ editing, defaultDate, onSubmit, onCancelEdit }: ExpenseFormProps) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<string>(CATEGORIES[0])
  const [date, setDate] = useState(defaultDate || todayKey())
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (editing) {
      setAmount(String(editing.amount))
      setCategory(editing.category)
      setDate(editing.date)
      setNote(editing.note)
      setError('')
    }
  }, [editing])

  useEffect(() => {
    if (!editing) setDate(defaultDate || todayKey())
  }, [defaultDate, editing])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const value = Number(amount.replace(',', '.'))
    if (!Number.isFinite(value) || value <= 0) {
      setError('Ingresa un monto mayor que cero.')
      return
    }
    onSubmit({ amount: value, category, date, note: note.trim() })
    setAmount('')
    setNote('')
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_2fr_auto]">
      <div>
        <label className={LABEL} htmlFor="amount">
          Monto
        </label>
        <input
          id="amount"
          className={INPUT}
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          placeholder="0"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          autoFocus
        />
      </div>

      <div>
        <label className={LABEL} htmlFor="category">
          Categoría
        </label>
        <select
          id="category"
          className={INPUT}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={LABEL} htmlFor="date">
          Fecha
        </label>
        <input
          id="date"
          className={INPUT}
          type="date"
          value={date}
          max={todayKey()}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>

      <div>
        <label className={LABEL} htmlFor="note">
          Nota
        </label>
        <input
          id="note"
          className={INPUT}
          type="text"
          placeholder="Opcional"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </div>

      <div className="flex items-end gap-2">
        <button
          type="submit"
          className="h-[38px] rounded-xl bg-teal-700 px-4 text-sm font-medium text-white transition hover:bg-teal-800"
        >
          {editing ? 'Guardar' : 'Agregar'}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="h-[38px] rounded-xl px-3 text-sm text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            Cancelar
          </button>
        )}
      </div>

      {error && <p className="text-sm text-rose-600 sm:col-span-5 dark:text-rose-400">{error}</p>}
    </form>
  )
}
