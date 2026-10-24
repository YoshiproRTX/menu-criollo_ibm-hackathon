---
id: D02
titulo: Store, bucle de juego y regla lineal
responsable: Daniel
agente: 4 argon
prioridad: A
status: done
bloqueado_por: [D01]
paralelizable_con: [G02, G03, G04, G05]
timebox_min: 30
---

# D02 — Store, bucle de juego y regla lineal

**Qué construir:** el corazón del frontend sin gráficos: un store zustand con
el bucle «instrucción → resultado → desastre o victoria → cromo». Con el chip
simple decide la regla lineal (TypeScript); con el cuántico decide la API.
Al ganar se sortea la rareza real y el cromo se guarda en el álbum. D03, D04 y
D05 solo leen y llaman a este store, así que **las acciones y el estado de
aquí son su contrato**: dejarlos estables y documentados en el propio archivo.

Leer antes: breadboard §4–§7 (N1, N10–N15, N20–N23, N30, S1–S9), README de
tickets, spec §«Decisiones de pruebas» punto 2.

## Detalle

- Estado: `escena` (`casa` | `parque`), `minijuegoId`, `config`, `modo`
  (`simple` | `cuantico`), `regla` (`angulo`, `desplazamiento`), `circuito`
  (`fichas`), `ultimoResultado` (predicciones, acierto, conjunto),
  `mapaActual` y `mapaAnterior`, `xray`, `estado` (`jugando` | `animando` |
  `ganado`), `cromoRevelado`, `nuevoDesastre`, `chispa` (texto actual),
  `primerFalloVisto`, `primeraFichaVista`, `cargando`, `error`.
- Acciones: `loadMinigame(id)`, `setMode`, `updateRuler`, `placeFicha`,
  `removeFicha`, `setEscala`, `runTask()`, `checkWin`, `registerDisaster`,
  `win(circuito?)`, `nextMinigame()`, `chispaSay(evento | texto)`.
- `classifyLinear(regla, puntos, config)`: función pura. Normal
  n = (cos a, sin a); positivo si n·x − d ≥ 0. Regla inicial genérica
  (`angulo: π/2`, `desplazamiento` = 90 % del rango) para que el primer
  intento falle.
- `placeFicha` / `removeFicha` / `setEscala`: actualizan el circuito y, con
  espera de 150 ms, piden `predictions` (`ejemplos`) y `decision-map`; guardan
  el mapa anterior para la animación. Un 422 revierte la ficha y pone `error`.
- `runTask()`: conjunto `prueba`; chip simple → regla; cuántico → API. Por
  cada objeto mal clasificado busca el desastre (`objeto`, `accion_erronea`) y
  lo registra una sola vez (`localStorage`, clave `qab.desastres`). Tras el
  primer fallo: `chispa.primer_fallo`. Si `acierto ≥ victoria.acierto_minimo`
  → `win()`.
- `win(circuito?)`: `drawRarity` con el circuito (o vacío en `doble-hueso`),
  guarda `{ minijuegoId, rareza, probabilidades, fecha }` en `localStorage`
  (`qab.cromos`, conservando la mejor rareza), pone `cromoRevelado` y
  `chispa.victoria`.
- Todo acceso a `localStorage` en try/catch.
- **Layout con huecos** para que D03, D04 y D05 corran en paralelo sin pisarse:
  `App.tsx` monta `<World />` (`world/World.tsx`), `<Hud />` (`world/Hud.tsx`),
  `<BrainConsole />` (`brain/BrainConsole.tsx`), `<CromoModal />` y
  `<AlbumModal />` (`meta/cromos/`), y `<ChispaBubble />` (`meta/chispa/`).
  Cada uno como marcador mínimo que lee el store. Después de D02 **nadie más
  edita `App.tsx`** salvo D06 (montaje del Nivel 2).

## Criterios de aceptación

- [x] Vitest con el cliente sustituido por los mocks del contrato:
  - [x] `runTask` con chip simple usa la regla y con el cuántico usa `predictions`.
  - [x] `checkWin` respeta el umbral del JSON.
  - [x] Un mismo fallo registra el desastre una sola vez.
  - [x] La victoria llama a `drawRarity` y guarda el cromo.
  - [x] Un 422 en `placeFicha` deja el circuito como estaba.
- [x] `classifyLinear` probada como función pura (1.1: existe una regla que
      llega a 100 % con los datos del JSON; 1.2: ninguna de una grilla supera 0.8).

## Notas

- El store exporta `setStoreDebounceMsForTests(0)` para que las pruebas unitarias corran sin esperar los 150 ms del debounce real.
- Incluye estado compartido para modales (`consolaAbierta`, `albumAbierto`, `xrayAbierto`) y Tormenta NISQ (`tormentaActiva`).
