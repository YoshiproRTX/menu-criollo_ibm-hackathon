---
id: G08
titulo: 2.1 Trucos, pantalla
responsable: Giovanni
agente: 6.1 sol
prioridad: B
status: ready-for-agent
bloqueado_por: [D01, G07]
paralelizable_con: [G06]
timebox_min: 30
---

# G08 — 2.1 Siéntate, Gira o Despega: pantalla

**Qué construir:** la interfaz propia del 2.1. Dos Perillas Doradas que el
jugador gira y el Termómetro de Mareo que sube o baja con la pérdida real;
con una perilla «arreglar Sentarse estropea Girar». Tras un primer intento a
mano se desbloquea el Silbato Auto-Entrenar, que anima el historial real.

Leer antes: README de tickets (interfaz entre carriles), spec historias 42–44,
`minijuegos.md` (2.1), `docs/ui-concept.md`.

## Detalle

- Solo en `frontend/src/minigames/trucos/`; componente por defecto con
  `PantallaNivel2Props`. Usa `getPredictions` y `postTrain` del cliente de D01.
- Al soltar una perilla (espera de 150 ms) se llama a `predictions` con las
  dos `perilla_dorada`; el termómetro muestra `perdida` y cada orden muestra
  el truco que haría Q-Boby.
- El silbato llama a `train` y anima el `historial` (≈ 60 ms por iteración),
  moviendo las perillas y el termómetro con los valores reales.
- Victoria: acierto 1.0 → `onWin({ fichas })` con las perillas finales.
  Fallo en un intento → `onDisaster(...)` con el desastre del JSON.
- Texto de Chispa: el entrenamiento ajusta θ; la inferencia solo los usa.

## Criterios de aceptación

- [ ] Mover perillas cambia el termómetro con la `perdida` de la API.
- [ ] El silbato anima exactamente el `historial` devuelto.
- [ ] Ganar llama `onWin` con las fichas de las perillas.

## Notas
