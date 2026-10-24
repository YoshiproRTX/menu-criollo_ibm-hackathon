---
id: G08
titulo: 2.1 Trucos, pantalla
responsable: Giovanni
agente: 6.1 sol
prioridad: B
status: blocked
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

- Código preparado en frontend/src/minigames/trucos/: dos perillas, espera de 150 ms al soltar, pérdida real, predicciones del último intento, desbloqueo tras intento manual e historial exacto a 60 ms por entrada. Tras entrenar se consulta inferencia final; solo acierto 1.0 llama onWin con las fichas finales. Cancelación al desmontar y protección frente a respuestas obsoletas. Prueba HTTP confirma historial sin interpolar y fichas finales ganadoras.

- Bloqueo: falta D01 y su cliente real. TypeScript, compilación, render estático y lógica comprobados en backend/ui-check, con copias desechables y adaptador exclusivo de pruebas. No se modificaron carpetas de Daniel.
- Montaje y revisión visual/interactiva del frontend principal pendientes; el navegador de revisión no arranca. Las casillas se conservan abiertas hasta comprobarlo en esa integración.
- Validación del carril: 84 pruebas backend y 12 pruebas UI, dos con HTTP real; TypeScript y build aprobados. Sin commits ni push.
