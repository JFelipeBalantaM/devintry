import { useMemo, useState } from 'react'
import type { Expense, Period } from './types'
import type { ExpenseDraft } from './useExpenses'
import { useExpenses } from './useExpenses'
import { Card } from './components/Card'
import { CategoryBreakdown } from './components/CategoryBreakdown'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { PeriodNav } from './components/PeriodNav'
import { SettingsPanel } from './components/SettingsPanel'
import { SummaryCards } from './components/SummaryCards'
import { ThemeToggle } from './components/ThemeToggle'
import { TrendChart } from './components/TrendChart'
import { download, toCsv } from './lib/csv'
import { elapsedDays, fromKey, startOfPeriod, toKey, todayKey } from './lib/date'
import { parseSnapshot } from './lib/storage'
import { byCategory, dailyAverage, inPeriod, previousPeriodTotal, sum, trend } from './lib/stats'
import { useTheme } from './useTheme'

const TREND_SIZE: Record<Period, number> = { day: 14, week: 12, month: 12 }

const TREND_TITLE: Record<Period, string> = {
  day: 'Últimos 14 días',
  week: 'Últimas 12 semanas',
  month: 'Últimos 12 meses',
}

export default function App() {
  const { expenses, settings, setSettings, add, update, remove, clear, restore } = useExpenses()
  const { theme, toggle: toggleTheme } = useTheme()
  const [period, setPeriod] = useState<Period>('day')
  const [anchor, setAnchor] = useState(() => new Date())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [importError, setImportError] = useState('')

  const visible = useMemo(() => inPeriod(expenses, anchor, period), [expenses, anchor, period])
  const total = useMemo(() => sum(visible), [visible])
  const monthTotal = useMemo(() => sum(inPeriod(expenses, new Date(), 'month')), [expenses])
  const buckets = useMemo(
    () => trend(expenses, anchor, period, TREND_SIZE[period], settings.locale),
    [expenses, anchor, period, settings.locale],
  )
  const categories = useMemo(() => byCategory(visible), [visible])
  const editing = useMemo(
    () => expenses.find((expense) => expense.id === editingId) ?? null,
    [expenses, editingId],
  )

  const defaultDate =
    startOfPeriod(anchor, period).getTime() === startOfPeriod(new Date(), period).getTime()
      ? todayKey()
      : toKey(startOfPeriod(anchor, period))

  function handleSubmit(draft: ExpenseDraft) {
    if (editing) {
      update(editing.id, draft)
      setEditingId(null)
    } else {
      add(draft)
      setAnchor(fromKey(draft.date))
    }
  }

  function handleEdit(expense: Expense) {
    setEditingId(expense.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleExportJson() {
    const snapshot = { version: 1, exportedAt: new Date().toISOString(), settings, expenses }
    download(`gastos-${todayKey()}.json`, JSON.stringify(snapshot, null, 2), 'application/json')
  }

  async function handleImport(file: File, mode: 'replace' | 'merge') {
    try {
      restore(parseSnapshot(await file.text()), mode)
      setImportError('')
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'No se pudo leer el archivo.')
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Gastos</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Todo se guarda solo en este navegador.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <button
            type="button"
            onClick={() => setShowSettings((open) => !open)}
            aria-expanded={showSettings}
            className="h-9 rounded-xl border border-neutral-300 px-3 text-sm transition hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Ajustes
          </button>
        </div>
      </header>

      {showSettings && (
        <Card className="mb-6">
          <SettingsPanel
            settings={settings}
            onSettingsChange={setSettings}
            onExportJson={handleExportJson}
            onExportCsv={() => download(`gastos-${todayKey()}.csv`, toCsv(expenses), 'text/csv')}
            onImport={handleImport}
            onClear={clear}
            importError={importError}
          />
        </Card>
      )}

      <div className="mb-6">
        <PeriodNav
          period={period}
          anchor={anchor}
          locale={settings.locale}
          onPeriodChange={setPeriod}
          onAnchorChange={setAnchor}
        />
      </div>

      <div className="mb-6">
        <SummaryCards
          period={period}
          total={total}
          previousTotal={previousPeriodTotal(expenses, anchor, period)}
          average={dailyAverage(visible, elapsedDays(anchor, period))}
          count={visible.length}
          budget={settings.monthlyBudget}
          monthTotal={monthTotal}
          settings={settings}
        />
      </div>

      <Card className="mb-6" title={editing ? 'Editar gasto' : 'Nuevo gasto'}>
        <ExpenseForm
          editing={editing}
          defaultDate={defaultDate}
          onSubmit={handleSubmit}
          onCancelEdit={() => setEditingId(null)}
        />
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3" title={TREND_TITLE[period]}>
          <TrendChart
            buckets={buckets}
            settings={settings}
            theme={theme}
            onSelect={(key) => setAnchor(fromKey(key))}
          />
        </Card>
        <Card className="lg:col-span-2" title="Por categoría">
          <CategoryBreakdown totals={categories} settings={settings} />
        </Card>
      </div>

      <Card className="mt-6" title="Movimientos">
        <ExpenseList
          expenses={visible}
          settings={settings}
          onEdit={handleEdit}
          onRemove={remove}
        />
      </Card>

      <footer className="mt-8 text-center text-xs text-neutral-400 dark:text-neutral-600">
        Sin cuentas ni servidor · exporta un respaldo para no perder tus datos
      </footer>
    </div>
  )
}
