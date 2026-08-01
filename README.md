# Gastos

Registro minimalista de gastos **diarios, semanales y mensuales**. No hay base de datos ni backend: todo se guarda en el `localStorage` del navegador y puedes exportar/importar un respaldo en JSON o CSV.

## Stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** para la interfaz
- **Recharts** para la gráfica de tendencia
- `localStorage` como única persistencia

## Uso

Requiere Node 22 (o >= 20.19).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/ (sitio estático)
npm run preview  # sirve dist/
npm run lint
```

## Funcionalidad

- Alta, edición y borrado de gastos con monto, categoría, fecha y nota.
- Vista **Día / Semana / Mes** con navegación entre periodos y botón "Hoy".
- Resumen del periodo: total, promedio diario, comparación con el periodo anterior y presupuesto mensual opcional.
- Gráfica de los últimos 14 días / 12 semanas / 12 meses; al hacer clic en una barra se abre ese periodo.
- Desglose por categoría con porcentaje.
- Moneda configurable (COP por defecto) y respaldo en JSON (importable) o CSV.
- Modo claro/oscuro con botón en la cabecera: arranca según la preferencia del sistema y recuerda tu elección.

## Despliegue

El build es estático, así que sirve `dist/` en cualquier hosting (Vercel, Netlify, GitHub Pages, Cloudflare Pages). `base` está configurado como `./`, por lo que también funciona en subrutas.

## Datos

Los gastos viven únicamente en el navegador donde los registras: borrar los datos del sitio los elimina y no se sincronizan entre dispositivos. Exporta un JSON periódicamente si quieres respaldo.
