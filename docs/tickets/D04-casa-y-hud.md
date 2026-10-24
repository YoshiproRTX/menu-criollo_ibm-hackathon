---
id: D04
titulo: Casa isométrica, Q-Anacleto y HUD
responsable: Daniel
agente: 4 argon
prioridad: A
status: ready-for-agent
bloqueado_por: [D02]
paralelizable_con: [D03, D05, G03, G04, G05]
timebox_min: 45
---

# D04 — Casa isométrica, Q-Anacleto y HUD

**Qué construir:** el Nivel 1 navegable. Se entra por la sala (1.1 Pelusa) y
se pasa a la cocina (1.2 Fregadero, 1.3 Chef); existen lavandería, baño y
habitación. Q-Anacleto, un robot low-poly expresivo, actúa sobre los objetos
de la cinta al pulsar **¡Hazlo, Q-Anacleto!**: acierta o provoca el desastre
cómico. El HUD muestra acierto, Chispa y botones de cerebro y álbum.

Leer antes: breadboard §3–§4 (P0, P1, U0–U9, N12), spec historias 1–12,
`docs/ui-concept.md`, imágenes de referencia en `imagenes/`.

## Detalle

- En `frontend/src/world/` y `frontend/src/meta/chispa/`. Lee y llama al store de D02.
- Escena con primitivas de three/drei (cajas, cilindros, esferas redondeadas),
  sin descargar assets; colores de `ui-concept.md`. Habitaciones como
  plataformas con paredes bajas; click en una puerta o en la estación de un
  minijuego mueve la cámara y llama a `loadMinigame(id)`. Solo hay estación
  si existe el JSON.
- **Q-Anacleto:** cuerpo de placas claras, cara LED (ojos que cambian:
  normal, feliz, pánico). **Chispa:** robot guía pequeño con burbuja de dos
  líneas (`chispa` del store).
- **Nota adhesiva** de ~1.5 s al cargar un minijuego con 2–3 ejemplos
  (emoji → acción), y `chispa.inicio`.
- **Cinta:** los objetos de `prueba` como emojis (drei `Html` o `Text`).
  `playOutcome`: recorre `ultimoResultado.predicciones`, Q-Anacleto va a cada
  objeto (≈ 300 ms cada uno) y hace la acción; si `correcto` es falso,
  animación de desastre (salto, giro, objeto volando) y el `texto` del
  desastre en grande. Las animaciones son decorativas; la acción mostrada es
  siempre `prediccion` de la API o la regla.
- **HUD:** acierto del último intento, dificultad ⭐ (solo informativa),
  botón abrir cerebro (abre D03), botón álbum (abre D05), aviso
  «¡Nuevo desastre!» cuando `nuevoDesastre` cambia.

## Criterios de aceptación

- [ ] Sala → cocina sin recargar; baño, habitación y lavandería visibles.
- [ ] En 1.2 con chip simple, al menos un desastre visible y aviso
      «¡Nuevo desastre!»; Chispa sugiere abrir el cerebro.
- [ ] La acción animada de cada objeto coincide con la predicción del store.
- [ ] Se ve bien a 1280×720.

## Notas
