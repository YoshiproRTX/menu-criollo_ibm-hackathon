---
id: D01
titulo: Esqueleto frontend y comando único
responsable: Daniel
agente: 4 argon
prioridad: A
status: done
bloqueado_por: []
paralelizable_con: [G01]
timebox_min: 25
---

# D01 — Esqueleto frontend y comando único

**Qué construir:** el proyecto Vite + React + TypeScript que muestra un canvas
isométrico vacío de React Three Fiber, importa los JSON de `content/`, y un
cliente de la API tipado que funciona contra el backend real **o** contra los
mocks de `content/contract/`. Más el comando único de la raíz que levanta
backend y frontend juntos. Es el ticket que desbloquea al resto del frontend
y a las pantallas de Giovanni (G05, G08): hacerlo primero y rápido.

Leer antes: `docs/tickets/README.md` (acuerdos congelados), breadboard §8 y §9.

## Detalle

- `frontend/` con npm: `react`, `react-dom`, `three`, `@react-three/fiber`,
  `@react-three/drei`, `zustand`; dev: `vite`, `@vitejs/plugin-react`,
  `typescript`, `vitest`. Alinear mayor de R3F con React (R3F 9 ↔ React 19).
- `vite.config.ts`: proxy `/api` → `http://localhost:8000`; alias `@content`
  → `../content` y `server.fs.allow` para la carpeta padre. Vitest configurado.
- Catálogo de minijuegos: `import.meta.glob('@content/minigames/*.json', { eager: true })`;
  los disponibles son los JSON que existan.
- `frontend/src/api/`: `types.ts` con los tipos del contrato (fichas,
  circuito, predictions, decision-map, xray, rarity-draws, estimates, train,
  error 422) y `client.ts` con una función por recurso: `getPredictions`,
  `getDecisionMap`, `getXray`, `drawRarity`, `postEstimates`, `postTrain`,
  `getHealth`. Con `VITE_MOCK=1` devuelven los JSON de `content/contract/`
  (si aún no existen, un mock en línea con la misma forma). Los 422 se
  convierten en un error tipado con `detail`.
- Raíz: `package.json` con `concurrently` y scripts:
  `setup` (`npm install && npm --prefix frontend install && uv sync --directory backend`),
  `dev` (backend `uv run --directory backend uvicorn app.main:app --port 8000`
  + `npm --prefix frontend run dev`), `dev:mock` (solo frontend con
  `VITE_MOCK=1`), `test` (pytest + vitest).
- Canvas a pantalla completa con cámara ortográfica isométrica, luz suave y
  fondo blanco cálido (`#FAF8F2`); capa HTML encima para la UI.
  Tokens de color de `docs/ui-concept.md` en CSS variables.

## Criterios de aceptación

- [x] `npm run setup && npm run dev` levanta ambos; si el backend no existe
      aún, `npm run dev:mock` funciona solo.
- [x] La página muestra el canvas isométrico y un indicador con
      `getHealth()` (versión de Qiskit o «mock»).
- [x] Prueba Vitest: el cliente en modo mock devuelve la forma de
      `predictions` y lanza error tipado ante un 422 simulado.
- [x] Avisar a Giovanni que el cliente y el esqueleto están listos (desbloquea G05).

## Notas

- `dev:mock` usa `vite --mode mock` con `.env.mock` (`VITE_MOCK=1`) para compatibilidad directa en Windows PowerShell/cmd y Unix sin añadir `cross-env`.
- `postEstimates` y `postTrain` soportan tanto `(body)` como `(id, body)` para facilitar la integración de G05 y G08.
