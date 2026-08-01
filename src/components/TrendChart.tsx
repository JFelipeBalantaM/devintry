import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Bucket } from '../lib/stats'
import type { Settings } from '../types'
import type { Theme } from '../useTheme'
import { formatCompact, formatMoney } from '../lib/format'

type TrendChartProps = {
  buckets: Bucket[]
  settings: Settings
  theme: Theme
  onSelect: (key: string) => void
}

export function TrendChart({ buckets, settings, theme, onSelect }: TrendChartProps) {
  const dark = theme === 'dark'
  const empty = buckets.every((bucket) => bucket.total === 0)

  if (empty) {
    return (
      <p className="py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Aún no hay gastos en este rango.
      </p>
    )
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={buckets} margin={{ top: 8, right: 4, bottom: 0, left: -12 }}>
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            tick={{ fontSize: 11, fill: 'currentColor' }}
            className="text-neutral-500"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={56}
            tickFormatter={(value: number) => formatCompact(value, settings)}
            tick={{ fontSize: 11, fill: 'currentColor' }}
            className="text-neutral-500"
          />
          <Tooltip
            cursor={{ fill: 'rgba(120,120,120,0.08)' }}
            formatter={(value) => [formatMoney(Number(value), settings), 'Total']}
            contentStyle={{
              borderRadius: 12,
              border: `1px solid ${dark ? 'rgb(64 64 64)' : 'rgb(212 212 212)'}`,
              backgroundColor: dark ? 'rgb(23 23 23)' : 'rgb(255 255 255)',
              color: dark ? 'rgb(245 245 245)' : 'rgb(23 23 23)',
              fontSize: 12,
              padding: '6px 10px',
            }}
            itemStyle={{ color: dark ? 'rgb(245 245 245)' : 'rgb(23 23 23)' }}
          />
          <Bar
            dataKey="total"
            radius={[6, 6, 0, 0]}
            onClick={(_, index: number) => onSelect(buckets[index].key)}
            className="cursor-pointer"
          >
            {buckets.map((bucket) => (
              <Cell
                key={bucket.key}
                fill={bucket.current ? (dark ? '#2dd4bf' : '#0f766e') : dark ? '#134e4a' : '#99f6e4'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
