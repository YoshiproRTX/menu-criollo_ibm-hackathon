---
id: D08
titulo: Límite de fichas, Tormenta NISQ y estaciones C
responsable: Daniel
agente: 4 argon
prioridad: C
status: done
bloqueado_por: [D03, D06]
bloqueo_suave: [G09]
paralelizable_con: [G09]
timebox_min: 20
---

# D08 — Límite de fichas, Tormenta NISQ y estaciones C

**Qué construir:** 1.4, 2.3 y 2.4 jugables con la consola genérica, sin
escena propia. En minijuegos con `limite_fichas` (2.4) la consola muestra el
contador de fichas y una Barra de Estática decorativa; pasarse del límite
desata la Tormenta NISQ (efecto visual + desastre) sin ejecutar el circuito.

Leer antes: spec §«Minijuego 2.4» e historias 52–52a.

## Detalle

- Contador «fichas usadas / límite». Al intentar colocar una de más: no se
  llama a la API, efecto de tormenta (sacudida, rayos CSS) y el desastre del
  JSON. Si el backend devuelve 422 por límite, mismo efecto.
- La Barra de Estática crece con el número de fichas y es solo visual; el
  robot decide siempre con `predictions` sin ruido. Texto pequeño: «La
  estática es decorativa».
- Estaciones: lavandería (1.4) en la casa; 2.3 y 2.4 en el parque, solo si
  existe su JSON.

## Criterios de aceptación

- [x] En 2.4, la sexta ficha dispara la Tormenta NISQ sin llamada a la API.
- [x] 1.4, 2.3 y 2.4 se pueden ganar desde su estación con los circuitos de
      `experiments/verificacion.md`.

## Notas

- `placeFicha` comprueba `config.limite_fichas` antes de llamar a la API y activa `tormentaActiva` más el desastre del JSON al intentar colocar una ficha de más.
- La Barra de Estática en `BrainConsole.tsx` incluye el aviso explícito de que es decorativa y el robot decide siempre con el circuito real sin ruido.
