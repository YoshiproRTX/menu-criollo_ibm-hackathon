---
id: G03
titulo: Mapa de decisión, Rayos-X y rareza
responsable: Giovanni
agente: 6.1 sol
prioridad: A
status: ready-for-agent
bloqueado_por: [G02]
paralelizable_con: [G04, G05, D02, D03, D04, D05, D06]
timebox_min: 30
---

# G03 — Mapa de decisión, Rayos-X y rareza

**Qué construir:** los tres recursos restantes del motor compartido, reales
con Qiskit, para cualquier minijuego `clasificacion`: el mapa que se dobla en
el radar, el Rayos-X con diagrama y código, y el sorteo de rareza de 1 shot
del cromo. Con esto el motor compartido queda completo para 1.1 y 1.2.

Leer antes: README de tickets, breadboard §8, spec §«Decisiones de pruebas».

## Detalle

- `decision-map`: `resolucion` opcional (32 por defecto, máximo 64). Grilla de
  centros de celda sobre `rango` (por defecto `[0, 1]`), `valores[fila *
  resolucion + columna]`, columna = sensor 0, fila = sensor 1, fila 0 abajo.
  Usa exactamente la misma función de predicción que `predictions`.
- `xray`: `diagrama` = `qc.draw("text")` como string del circuito sobre el
  objeto estrella; `codigo` = código Python autocontenido (imports incluidos)
  que construye ese mismo `qc` con ángulos numéricos y un comentario que diga
  qué sensor codifica cada giro.
- `rarity-draws`: 1 shot con `StatevectorSampler` (con `seed` si llega
  `semilla`) del circuito del jugador sobre el objeto estrella, midiendo ambos
  qubits. `probabilidades` por rareza desde `Statevector`. Mapeo `q1q0` del
  README. `shots: 1`.
- `rarity-draws` para `tipo: doble-hueso` lo resuelve G04 y para `trucos`, G07;
  aquí dejar el despacho por `tipo` preparado.

## Criterios de aceptación

- [ ] `decision-map` del 1.2 devuelve `resolucion²` valores en [0, 1] y, para
      los centros de celda, coincide con `predictions` sobre esos puntos
      (prueba con una grilla pequeña).
- [ ] Mapa 32×32 en < 500 ms en local (medido en `meta.ms`).
- [ ] El `codigo` del Rayos-X, ejecutado con `exec`, produce un circuito cuyo
      `Operator` es equivalente al del backend.
- [ ] Rareza: las probabilidades suman 1 y coinciden con el `Statevector`; con
      `semilla` fija el `resultado` es reproducible; `rareza` es coherente con
      `resultado`.
- [ ] Formas iguales a `content/contract/` (salvo `meta.simulador`).
- [ ] `uv run pytest` verde.

## Notas
