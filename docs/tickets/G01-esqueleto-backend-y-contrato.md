---
id: G01
titulo: Esqueleto backend y contrato congelado
responsable: Giovanni
agente: 6.1 sol
prioridad: A
status: ready-for-agent
bloqueado_por: []
paralelizable_con: [D01]
timebox_min: 20
---

# G01 — Esqueleto backend y contrato congelado

**Qué construir:** un backend FastAPI que arranca con un comando, responde
`GET /api/health` con la versión real de Qiskit, carga cualquier JSON de
`content/minigames/` por id y devuelve `404` si no existe. Además, las
respuestas de ejemplo del contrato en `content/contract/`, que Daniel usa como
mocks **desde el minuto 20**. Este ticket es el que desbloquea a los demás:
hacerlo primero y rápido.

Leer antes: `docs/tickets/README.md` (acuerdos congelados), breadboard §8 y §9,
skill `qiskit` (SKILL.md).

## Detalle

- Proyecto uv en `backend/` con `qiskit==2.5.2`, `fastapi`, `uvicorn[standard]`;
  dev: `pytest`, `httpx`. App en `app.main:app`; módulos pequeños según la
  spec: `content`, `circuits`, `model`, `rarity`, `xray`, `qae`, `gradients`,
  `api` (los vacíos se llenan en los tickets siguientes).
- El cargador busca `content/` relativo a la raíz del repo (no al directorio
  de trabajo), con caché en memoria.
- Rutas montadas bajo `/api`. Las de recursos (`predictions`, `decision-map`,
  `xray`, `rarity-draws`, `estimates`, `train`) pueden quedar como `501` hasta
  su ticket, pero el `404` por id inexistente ya funciona.
- `content/contract/` con un JSON por recurso, copiando la forma exacta de la
  §8 del breadboard: `predictions.json`, `decision-map.json` (1024 valores
  sintéticos, un degradado basta), `xray.json`, `rarity-draws.json`,
  `estimates.monte_carlo.json`, `estimates.qae.json`, `train.json`,
  `error-422.json`. Todos con `"simulador": "mock"` en `meta`.
- `content/minigames/fregadero.json` mínimo válido (puede ser el ejemplo de la
  §9 del breadboard; G02 lo reemplaza por los datos verificados).

## Criterios de aceptación

- [ ] `uv run uvicorn app.main:app --port 8000` desde `backend/` arranca sin errores.
- [ ] `GET /api/health` → `{ "ok": true, "qiskit": "2.5.2" }`.
- [ ] `POST /api/minigames/no-existe/predictions` → `404` con `detail` en español.
- [ ] Los 8 archivos de `content/contract/` existen y respetan la §8.
- [ ] `uv run pytest` pasa con al menos la prueba de health y la del 404.
- [ ] Avisar a Daniel (por chat del equipo) que los fixtures están listos.

## Notas
