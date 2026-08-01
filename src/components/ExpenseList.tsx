import type { Expense, Settings } from '../types'
import { categoryColor } from '../lib/categories'
import { fromKey, todayKey } from '../lib/date'
import { formatMoney } from '../lib/format'
import { groupByDay } from '../lib/stats'

type ExpenseListProps = {
  expenses: Expense[]
  settings: Settings
  onEdit: (expense: Expense) => void
  onRemove: (id: string) => void
}

export function ExpenseList({ expenses, settings, onEdit, onRemove }: ExpenseListProps) {
  const groups = groupByDay(expenses)

  if (groups.length === 0) {
    return (
      <div className="py-14 text-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No hay gastos registrados en este periodo.
        </p>
        <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
          Usa el formulario de arriba para agregar el primero.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.date}>
          <div className="mb-2 flex items-baseline justify-between border-b border-neutral-200 pb-1.5 dark:border-neutral-800">
            <h3 className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              {dayLabel(group.date, settings.locale)}
            </h3>
            <span className="text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
              {formatMoney(group.total, settings)}
            </span>
          </div>
          <ul className="divide-y divide-neutral-100 dark:divide-neutral-800/70">
            {group.items.map((expense) => (
              <li key={expense.id} className="group flex items-center gap-3 py-2.5">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: categoryColor(expense.category) }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {expense.note || expense.category}
                  </p>
                  {expense.note && (
                    <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                      {expense.category}
                    </p>
                  )}
                </div>
                <span className="text-sm font-medium tabular-nums">
                  {formatMoney(expense.amount, settings)}
                </span>
                <div className="flex gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                  <RowButton label="Editar" onClick={() => onEdit(expense)}>
                    Editar
                  </RowButton>
                  <RowButton label="Eliminar" danger onClick={() => onRemove(expense.id)}>
                    Borrar
                  </RowButton>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function RowButton({
  label,
  onClick,
  danger,
  children,
}: {
  label: string
  onClick: () => void
  danger?: boolean
  children: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`rounded-lg px-2 py-1 text-xs transition ${
        danger
          ? 'text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40'
          : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
      }`}
    >
      {children}
    </button>
  )
}

function dayLabel(key: string, locale: string): string {
  if (key === todayKey()) return 'Hoy'
  const label = fromKey(key).toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return label.charAt(0).toUpperCase() + label.slice(1)
}
