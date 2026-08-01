export const CATEGORIES = [
  'Comida',
  'Transporte',
  'Hogar',
  'Salud',
  'Ocio',
  'Compras',
  'Servicios',
  'Otros',
] as const

const PALETTE = [
  '#0f766e',
  '#2563eb',
  '#7c3aed',
  '#db2777',
  '#ea580c',
  '#ca8a04',
  '#16a34a',
  '#64748b',
]

export function categoryColor(category: string): string {
  const index = CATEGORIES.indexOf(category as (typeof CATEGORIES)[number])
  if (index >= 0) return PALETTE[index]
  let hash = 0
  for (const char of category) hash = (hash * 31 + char.charCodeAt(0)) % PALETTE.length
  return PALETTE[hash]
}
