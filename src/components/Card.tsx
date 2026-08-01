import type { ReactNode } from 'react'

type CardProps = {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function Card({ title, action, children, className = '' }: CardProps) {
  return (
    <section
      className={`rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 ${className}`}
    >
      {(title || action) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          {title && (
            <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">{title}</h2>
          )}
          {action}
        </header>
      )}
      {children}
    </section>
  )
}
