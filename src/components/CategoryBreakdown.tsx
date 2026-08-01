import type { CategoryTotal } from '../lib/stats'
import type { Settings } from '../types'
import { categoryColor } from '../lib/categories'
import { formatMoney, formatPercent } from '../lib/format'

type CategoryBreakdownProps = {
  totals: CategoryTotal[]
  settings: Settings
}

export function CategoryBreakdown({ totals, settings }: CategoryBreakdownProps) {
  if (totals.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Sin categorías todavía.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {totals.map((item) => (
        <li key={item.category}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: categoryColor(item.category) }}
              />
              {item.category}
            </span>
            <span className="tabular-nums">
              {formatMoney(item.total, settings)}
              <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
                {formatPercent(item.share, settings.locale)}
              </span>
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
            <div
              className="h-full rounded-full"
              style={{ width: `${item.share * 100}%`, backgroundColor: categoryColor(item.category) }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
