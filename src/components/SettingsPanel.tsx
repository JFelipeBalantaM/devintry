import { useRef, useState } from 'react'
import type { Settings } from '../types'
import { CURRENCIES } from '../lib/currencies'

const INPUT =
  'w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-neutral-700 dark:bg-neutral-950'

const LABEL = 'mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400'

const ACTION =
  'rounded-xl border border-neutral-300 px-3 py-2 text-sm transition hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800'

type SettingsPanelProps = {
  settings: Settings
  onSettingsChange: (settings: Settings) => void
  onExportJson: () => void
  onExportCsv: () => void
  onImport: (file: File, mode: 'replace' | 'merge') => void
  onClear: () => void
  importError: string
}

export function SettingsPanel({
  settings,
  onSettingsChange,
  onExportJson,
  onExportCsv,
  onImport,
  onClear,
  importError,
}: SettingsPanelProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('merge')

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="currency">
            Moneda
          </label>
          <select
            id="currency"
            className={INPUT}
            value={settings.currency}
            onChange={(event) => {
              const found = CURRENCIES.find((item) => item.code === event.target.value)
              if (found) onSettingsChange({ ...settings, currency: found.code, locale: found.locale })
            }}
          >
            {CURRENCIES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={LABEL} htmlFor="budget">
            Presupuesto mensual
          </label>
          <input
            id="budget"
            className={INPUT}
            type="number"
            min="0"
            step="any"
            placeholder="Sin presupuesto"
            value={settings.monthlyBudget ?? ''}
            onChange={(event) => {
              const value = Number(event.target.value)
              onSettingsChange({
                ...settings,
                monthlyBudget: event.target.value === '' || value <= 0 ? null : value,
              })
            }}
          />
        </div>
      </div>

      <div>
        <p className={LABEL}>Respaldo de datos</p>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={ACTION} onClick={onExportJson}>
            Exportar JSON
          </button>
          <button type="button" className={ACTION} onClick={onExportCsv}>
            Exportar CSV
          </button>
          <button type="button" className={ACTION} onClick={() => fileInput.current?.click()}>
            Importar JSON
          </button>
          <label className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            <input
              type="checkbox"
              checked={importMode === 'replace'}
              onChange={(event) => setImportMode(event.target.checked ? 'replace' : 'merge')}
            />
            reemplazar al importar
          </label>
          <button
            type="button"
            className="rounded-xl border border-rose-300 px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/40"
            onClick={() => {
              if (confirm('¿Borrar todos los gastos guardados en este navegador?')) onClear()
            }}
          >
            Borrar todo
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) onImport(file, importMode)
              event.target.value = ''
            }}
          />
        </div>
        {importError && <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">{importError}</p>}
      </div>
    </div>
  )
}
