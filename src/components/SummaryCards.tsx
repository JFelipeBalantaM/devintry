import type { Period, Settings } from '../types'
import { formatMoney, formatPercent } from '../lib/format'

const TOTAL_LABEL: Record<Period, string> = {
  day: 'Total del día',
  week: 'Total de la semana',
  month: 'Total del mes',
}

const PREVIOUS_LABEL: Record<Period, string> = {
  day: 'vs. día anterior',
  week: 'vs. semana anterior',
  month: 'vs. mes anterior',
}

type SummaryCardsProps = {
  period: Period
  total: number
  previousTotal: number
  average: number
  count: number
  budget: number | null
  monthTotal: number
  settings: Settings
}

export function SummaryCards({
  period,
  total,
  previousTotal,
  average,
  count,
  budget,
  monthTotal,
  settings,
}: SummaryCardsProps) {
  const change = previousTotal > 0 ? total / previousTotal - 1 : null

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Stat label={TOTAL_LABEL[period]} value={formatMoney(total, settings)} accent>
        {count === 1 ? '1 gasto' : `${count} gastos`}
      </Stat>

      <Stat label="Promedio diario" value={formatMoney(average, settings)}>
        sobre los días transcurridos
      </Stat>

      <Stat label={PREVIOUS_LABEL[period]} value={formatMoney(previousTotal, settings)}>
        {change === null ? (
          'sin datos previos'
        ) : (
          <span className={change > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-teal-700 dark:text-teal-400'}>
            {change > 0 ? '▲' : '▼'} {formatPercent(Math.abs(change), settings.locale)}
          </span>
        )}
      </Stat>

      {budget === null ? (
        <Stat label="Presupuesto mensual" value="—">
          defínelo en Ajustes
        </Stat>
      ) : (
        <Stat label="Presupuesto mensual" value={formatMoney(budget, settings)}>
          <BudgetBar spent={monthTotal} budget={budget} locale={settings.locale} />
        </Stat>
      )}
    </div>
  )
}

function Stat({
  label,
  value,
  accent,
  children,
}: {
  label: string
  value: string
  accent?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
        {label}
      </p>
      <p
        className={`mt-1 text-2xl font-semibold tabular-nums ${
          accent ? 'text-teal-700 dark:text-teal-400' : ''
        }`}
      >
        {value}
      </p>
      <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{children}</div>
    </div>
  )
}

function BudgetBar({ spent, budget, locale }: { spent: number; budget: number; locale: string }) {
  const ratio = Math.min(spent / budget, 1)
  const over = spent > budget
  return (
    <div className="mt-2">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        <div
          className={`h-full rounded-full ${over ? 'bg-rose-500' : 'bg-teal-600'}`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <p className="mt-1">
        {formatPercent(spent / budget, locale)} usado del mes
        {over ? ' · excedido' : ''}
      </p>
    </div>
  )
}
