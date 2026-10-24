# Tickets — Q-Anacleto y Q-Boby

Fuente de verdad: [goal.md](../../goal.md) → [docs/spec.md](../spec.md) →
[breadboard-fregadero.md](../../breadboard-fregadero.md) (contrato §8, formato §9)
→ [minijuegos.md](../../minijuegos.md) (textos, objetos, desastres).
Orquestación de los agentes: [PATH.md](../../PATH.md).

## Responsables

| Prefijo | Persona | Agente | Carril |
| --- | --- | --- | --- |
| `G` | **Giovanni** | 6.1 sol | Backend Qiskit, `content/` y las dos pantallas propias del Nivel 2 (2.2 y 2.1) |
| `D` | **Daniel** | 4 argon | Todo el frontend del motor compartido: comando único, store, consola del cerebro, casa, parque, Chispa, cromos y álbumes |
| `I` | **Giano** | Opus 5.5 | Integración final y happy path de la demo |

## Tickets y bloqueos

Prioridad: **A** obligatorio para el video · **B** solo si A está integrado antes
de T+90 min · **C** solo configuración corriendo de verdad.

| Ticket | Persona | Prio | Bloqueado por | Paralelizable con |
| --- | --- | --- | --- | --- |
| [G01 Esqueleto backend y contrato congelado](G01-esqueleto-backend-y-contrato.md) | Giovanni | A | — | D01 |
| [G02 Predicciones reales en 1.1 y 1.2](G02-predicciones-1-1-y-1-2.md) | Giovanni | A | G01 | G04, todo D |
| [G03 Mapa de decisión, Rayos-X y rareza](G03-mapa-rayosx-rareza.md) | Giovanni | A | G02 | G04, G05, todo D |
| [G04 2.2 Doble Hueso: backend QAE y Monte Carlo](G04-doble-hueso-backend.md) | Giovanni | A | G01 | G02, G03, todo D |
| [G05 2.2 Doble Hueso: pantalla](G05-doble-hueso-pantalla.md) | Giovanni | A | D01 (G04 para datos reales; antes usa mocks) | G02, G03, D02–D05 |
| [G06 1.3 Chef Catástrofe: perilla de escala (backend)](G06-chef-perilla-escala-backend.md) | Giovanni | B | G03 | G07, D07 |
| [G07 2.1 Trucos: backend parameter-shift](G07-trucos-backend.md) | Giovanni | B | G01 | G06 |
| [G08 2.1 Trucos: pantalla](G08-trucos-pantalla.md) | Giovanni | B | D01, G07 | G06 |
| [G09 Configuraciones C (1.4, 2.3, 2.4)](G09-configs-c.md) | Giovanni | C | G03 | D08 |
| [D01 Esqueleto frontend y comando único](D01-esqueleto-frontend-y-comando-unico.md) | Daniel | A | — (lee fixtures de G01 cuando existan) | G01 |
| [D02 Store, bucle de juego y regla lineal](D02-store-y-bucle-de-juego.md) | Daniel | A | D01 | G02–G05 |
| [D03 Consola del cerebro y radar](D03-consola-del-cerebro.md) | Daniel | A | D02 | D04, D05 |
| [D04 Casa isométrica, Q-Anacleto y HUD](D04-casa-y-hud.md) | Daniel | A | D02 | D03, D05 |
| [D05 Cromo, Rayos-X y álbumes](D05-cromos-rayosx-albumes.md) | Daniel | A | D02 | D03, D04 |
| [D06 Parque, Q-Boby y montaje del Nivel 2](D06-parque-y-montaje-nivel-2.md) | Daniel | A | D04 (G05 para montar la pantalla real) | D03, D05 |
| [D07 Perilla de escala en la consola](D07-perilla-de-escala-ui.md) | Daniel | B | D03 (G06 para datos reales) | G06 |
| [D08 Límite de fichas, Tormenta NISQ y estaciones C](D08-limite-fichas-y-estaciones-c.md) | Daniel | C | D03, D06 | G09 |
| [I01 Integración y happy path](I01-integracion-happy-path.md) | Giano | A | G03, G05, D03–D06 | — |

```
Giovanni:  G01 ─┬─ G02 ── G03 ─┬─ G06 (B)
                │              └─ G09 (C)
                ├─ G04 ── G05*
                └─ G07 (B) ── G08* (B)
Daniel:    D01 ── D02 ─┬─ D03 ─┬─ D07 (B)
                       ├─ D04 ─┴─ D06 ── D08 (C)
                       └─ D05
Giano:     I01 cuando G03, G05, D03–D06 estén en main      (* también bloqueado por D01)
```

Cada persona puede correr **varias sesiones del agente a la vez** sobre los
tickets de una misma fila «Paralelizable con», porque tocan carpetas distintas.

## Acuerdos congelados (no cambiar sin avisar al otro carril)

Estos acuerdos concretan el contrato de la §8 y el formato de la §9 del
breadboard. Todo lo nuevo es **aditivo**.

### Carpetas y dueños

| Carpeta | Dueño | El otro carril |
| --- | --- | --- |
| `backend/` | Giovanni | no toca |
| `content/minigames/*.json` | Giovanni | solo lee (el frontend los importa) |
| `content/contract/*.json` (respuestas de ejemplo) | Giovanni | solo lee (mocks del frontend) |
| `frontend/src/minigames/doble-hueso/`, `frontend/src/minigames/trucos/` | Giovanni | solo los monta |
| `package.json` raíz y resto de `frontend/` | Daniel | solo lee |
| `frontend/src/api/` (tipos y cliente, incluye `estimates` y `train`) | Daniel | Giovanni lo usa; pide cambios por chat |

### Ejecución

- Backend: proyecto uv en `backend/`, Python ≥ 3.11, `qiskit==2.5.2` (la
  versión verificada), FastAPI, uvicorn; pytest y httpx como dependencias de
  desarrollo. App en `app.main:app`. Arranque: `uv run uvicorn app.main:app --port 8000`
  desde `backend/`.
- Frontend: **npm** (gestor fijado aquí), Vite + React + TypeScript en
  `frontend/`, puerto 5173, proxy de `/api` a `http://localhost:8000`.
- Raíz: `npm run setup` instala todo y `npm run dev` levanta ambos con
  `concurrently`.
- `GET /api/health` → `{ "ok": true, "qiskit": "2.5.2" }` (aditivo; sirve para
  el humo de la integración).

### Ids de minijuego (= nombre del JSON)

| Minijuego | id | `tipo` |
| --- | --- | --- |
| 1.1 Pelusa Rebelde | `pelusa` | `clasificacion` |
| 1.2 Fiebre en el Fregadero | `fregadero` | `clasificacion` |
| 1.3 Chef Catástrofe | `chef` | `clasificacion` |
| 1.4 Lavandería en Remolino | `lavanderia` | `clasificacion` |
| 2.1 Siéntate, Gira o Despega | `trucos` | `trucos` |
| 2.2 Doble Hueso | `doble-hueso` | `doble-hueso` |
| 2.3 Pista Láser-Musical | `pista` | `clasificacion` |
| 2.4 Gran Copa Canina | `copa` | `clasificacion` |

Orden del recorrido (botón «continuar» del cromo): `pelusa → fregadero → chef →
lavanderia → doble-hueso → trucos → pista → copa`, saltando los que no tengan
JSON.

### Campos aditivos del formato de configuración

- `tipo`: `"clasificacion"` (por defecto), `"doble-hueso"` o `"trucos"`.
- `rango`: `[min, max]` de ambos sensores; por defecto `[0, 1]`. El 1.3 y el
  1.4 usan `[-1, 1]`. El radar y el `decision-map` cubren ese rango.
- Las etiquetas de los objetos se expresan con la acción (`objetos.<o>.accion`).
  La acción positiva es `lectura.accion`.

### Semántica del motor compartido (backend y regla lineal del frontend)

- Circuito: 2 qubits. Las fichas se aplican por `pos` ascendente; dentro de la
  misma `pos`, el cable 0 antes que el 1. `cable_gemelo` en `cable: c` es
  `CX(c → 1−c)` y ocupa ambos cables en esa `pos`.
- `giro_y` / `giro_z` en el cable *i*: `RY/RZ(escala · x[i])`, con `escala` de
  la ficha si viene, si no `codificacion.escala`.
- `p_accion` = probabilidad exacta (`Statevector`) de que los qubits de
  `lectura.qubits` den `lectura.resultado` (los caracteres de `resultado` van
  en el mismo orden que `lectura.qubits`). `prediccion` = `lectura.accion` si
  `p_accion ≥ 0.5`, si no `lectura.otra`.
- `acierto` = fracción de objetos del conjunto con `correcto: true`.
- Errores: FastAPI estándar, `{ "detail": "<mensaje en español>" }`.
- `rarity-draws` acepta `semilla` opcional (aditivo, para pruebas). El objeto
  estrella es el primer elemento de `ejemplos` cuyo `objeto` es
  `objeto_estrella`. Se miden ambos qubits; cadena de Qiskit `q1q0`:
  `00` común, `01` rara, `10` holográfica, `11` legendaria.
- `meta` = `{ "qiskit": qiskit.__version__, "simulador": "Statevector" | "StatevectorSampler", "ms": <entero> }`.
  En las respuestas de ejemplo de `content/contract/` va `"simulador": "mock"`
  para que nunca se confundan con datos reales.

### Interfaz entre carriles en el frontend

Las pantallas propias del Nivel 2 son componentes React por defecto en
`frontend/src/minigames/<id>/index.tsx` con estas props:

```ts
type PantallaNivel2Props = {
  config: unknown;                          // el JSON del minijuego; la pantalla lo tipa
  onWin: (circuito?: { fichas: Ficha[] }) => void; // el store sortea la rareza y revela el cromo
  onDisaster: (desastreId: string) => void;  // el store lo registra en el álbum
  chispaSay: (texto: string) => void;        // burbuja de Chispa
};
```

## Reglas para todos los agentes

- Leer `AGENTS.md`. Nada de commits ni push sin que su humano lo autorice.
- Nunca inventar una predicción, acierto, pérdida, trayectoria o rareza. Lo
  decorativo (animaciones, estática, temblor del mapa) sí se simula.
- Sin dependencias nuevas fuera del stack (FastAPI, Qiskit, uvicorn, pytest,
  httpx; React, Vite, TS, three, @react-three/fiber, @react-three/drei,
  zustand, Vitest, concurrently). Sin `qiskit-aer` ni `qiskit-algorithms`.
- Ante una duda que cueste más de 5 minutos: elegir lo estándar y más simple,
  anotarlo en la sección «Notas» del ticket y seguir.
- **El estado vive en el frontmatter de cada ticket** (no hay GitHub Issues).
  Valores de `status`: `ready-for-agent` → `in-progress` → `done`, o
  `blocked` con el motivo en «Notas». Al empezar, poner `in-progress`; al
  cerrar, marcar las casillas y poner `done`. Ver todos:
  `grep -H "^status:" docs/tickets/*.md`.
