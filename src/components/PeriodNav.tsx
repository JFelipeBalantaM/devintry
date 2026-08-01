import type { Period } from '../types'
import { periodLabel, shiftPeriod, startOfPeriod } from '../lib/date'

const OPTIONS: { value: Period; label: string }[] = [
  { value: 'day', label: 'Día' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
]

type PeriodNavProps = {
  period: Period
  anchor: Date
  locale: string
  onPeriodChange: (period: Period) => void
  onAnchorChange: (anchor: Date) => void
}

export function PeriodNav({
  period,
  anchor,
  locale,
  onPeriodChange,
  onAnchorChange,
}: PeriodNavProps) {
  const isCurrent =
    startOfPeriod(anchor, period).getTime() === startOfPeriod(new Date(), period).getTime()

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div
        role="tablist"
        aria-label="Rango"
        className="inline-flex rounded-xl bg-neutral-200/70 p-1 dark:bg-neutral-800"
      >
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={option.value === period}
            onClick={() => onPeriodChange(option.value)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
              option.value === period
                ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-950 dark:text-neutral-50'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1">
        <NavButton label="Periodo anterior" onClick={() => onAnchorChange(shiftPeriod(anchor, period, -1))}>
          ‹
        </NavButton>
        <span className="min-w-40 text-center text-sm font-medium">
          {periodLabel(anchor, period, locale)}
        </span>
        <NavButton
          label="Periodo siguiente"
          disabled={isCurrent}
          onClick={() => onAnchorChange(shiftPeriod(anchor, period, 1))}
        >
          ›
        </NavButton>
        {!isCurrent && (
          <button
            type="button"
            onClick={() => onAnchorChange(new Date())}
            className="ml-1 rounded-lg px-2.5 py-1 text-sm text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950"
          >
            Hoy
          </button>
        )}
      </div>
    </div>
  )
}

function NavButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="h-8 w-8 rounded-lg text-lg leading-none text-neutral-600 transition hover:bg-neutral-200 disabled:opacity-30 disabled:hover:bg-transparent dark:text-neutral-400 dark:hover:bg-neutral-800"
    >
      {children}
    </button>
  )
}
