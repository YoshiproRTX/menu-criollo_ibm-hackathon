---
id: G01
titulo: Esqueleto backend y contrato congelado
responsable: Giovanni
agente: 6.1 sol
prioridad: A
status: done
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

- [x] `uv run uvicorn app.main:app --port 8000` desde `backend/` arranca sin errores.
- [x] `GET /api/health` → `{ "ok": true, "qiskit": "2.5.2" }`.
- [x] `POST /api/minigames/no-existe/predictions` → `404` con `detail` en español.
- [x] Los 8 archivos de `content/contract/` existen y respetan la §8.
- [x] `uv run pytest` pasa con al menos la prueba de health y la del 404.
- [ ] Avisar a Daniel (por chat del equipo) que los fixtures están listos.

## Notas

- Completado técnicamente el 24 de octubre de 2026. Cambios limitados a
  `backend/`, `content/` y este ticket. Sin commits ni push.
- Proyecto uv y lockfile reproducible; comprobado con Python 3.13.7 y
  Qiskit 2.5.2. Arranque ASGI real verificado en localhost:8000, con HTTP
  200/404/501. Suite completa: **33 passed**.
- Cargador con caché acotada, rutas relativas al repositorio, rechazo de
  traversal y copias independientes para los consumidores. Configuración
  mínima de fregadero tomada del ejemplo de la §9; los datos verificados
  corresponden a G02.
- Los ocho fixtures son sintéticos y llevan `meta.simulador: "mock"` y
  `meta.ms: 0`, incluso xray, rareza y error-422 (campos aditivos exigidos
  por este ticket). Los endpoints existentes siguen en 501; nunca sirven
  esos mocks como resultados del modelo. Train usa dos ángulos por punto
  del historial; las estimaciones incluyen un último punto coherente con
  `consultas_usadas`.
- Dependencias solo del stack aprobado. Starlette emite una advertencia
  de deprecación por TestClient con httpx; las pruebas pasan. No se añadió
  httpx2 ni se ocultó la advertencia.
- Aviso externo a Daniel **pendiente de envío humano**: no hay un canal de
  chat del equipo identificado en esta sesión. Mensaje listo para compartir:
  **«G01 listo: fixtures en content/contract/, fregadero mínimo en
  content/minigames/ y backend en app.main:app. Health devuelve Qiskit 2.5.2.
  Los ocho fixtures llevan simulador mock; puedes usarlos en D01.»**
  La casilla de ese aviso permanece abierta; `done` registra la implementación
  y verificación terminadas, sin afirmar que el aviso externo fue enviado.
- Siguiente ola: G02 y G04, en sesiones separadas según PATH.md. Esta sesión
  implementa exclusivamente G01.
