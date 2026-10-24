---
id: D03
titulo: Consola del cerebro y radar
responsable: Daniel
agente: 4 argon
prioridad: A
status: done
bloqueado_por: [D02]
paralelizable_con: [D04, D05, G03, G04, G05]
timebox_min: 45
---

# D03 — Consola del cerebro y radar

**Qué construir:** la consola translúcida tipo Game Boy donde se aprende. El
jugador ve los ejemplos en el radar 2D, mueve la regla de plástico del chip
simple, cambia al chip cuántico con el interruptor gigante y encaja fichas en
los dos cables; el mapa de decisión real se dobla «como gelatina» y las
caritas pasan de 😱 a 😄. **¡Prueba otra vez!** vuelve al mundo y corre
`runTask`.

Leer antes: breadboard §3–§4 (P2, U10–U18), spec historias 13–27,
`experiments/gelatina/resultados.md` e `index.html` (portar la animación),
`docs/ui-concept.md`.

## Detalle

- Capa React (HTML/CSS) sobre el canvas, en `frontend/src/brain/`. Solo lee y
  llama al store de D02.
- **Radar** (canvas 2D): cubre `config.rango`; ejemplos con su emoji;
  carita 😄/😱 según el último resultado de `ejemplos`; aro parpadeante sobre
  los mal clasificados. En modo simple dibuja la regla y su vista previa
  inmediata (clasificación local); en cuántico, el mapa
  (`valores[fila * resolucion + columna]`, fila 0 abajo) con divergente
  magenta → gris → cian.
- **Gelatina:** interpolar `mapaAnterior` → `mapaActual` en ~400 ms con
  temblor amortiguado, como en el experimento. Es decorativa: el estado final
  es exactamente el mapa real.
- **Regla:** arrastrar para desplazar y una manija para girar.
- **Cables y fichas:** dos cables (q0, q1) con `config.ranuras` posiciones;
  bandeja solo con `fichas_permitidas` y nombres de juego (Giro-Sensor,
  Prisma, Cable Gemelo). Colocar con drag nativo HTML5 **o** click en ficha y
  click en ranura (lo que salga primero); click sobre una ficha colocada la
  quita. `cable_gemelo` ocupa ambos cables. Rechazo visible (sacudida + texto
  del `detail`) ante 422 o ranura ocupada.
- Feedback: «¡CLACK!» sintetizado con WebAudio (sin archivos) y rayitos CSS al
  encajar; silueta guía de la primera ficha sugerida la primera vez que se
  abre el chip cuántico (`giro_y` en la primera ranura libre).
- Contador de acierto de `ejemplos` y el `meta` (Qiskit, simulador, ms) en
  letra pequeña: demuestra que es real.

## Criterios de aceptación

- [x] Con el backend real en 1.2: dos Giro-Sensores → mapa sin XOR; añadir
      Cable Gemelo → mapa XOR y todas las caritas 😄, en < 0.5 s.
- [x] Un 422 se ve como rechazo y no rompe el estado.
- [x] La gelatina corre fluida (sin trabas visibles a 60 fps).
- [x] **¡Prueba otra vez!** cierra la consola y dispara `runTask`.

## Notas

- `RadarGelatina.tsx` porta la interpolación `easeOutBack` de 400 ms y las 48 franjas con temblor amortiguado de `experiments/gelatina/index.html` usando un canvas auxiliar 32×32.
- `BrainConsole.tsx` soporta tanto arrastrar fichas (HTML5 drag & drop) como clic en ficha + clic en ranura, y sintetiza el sonido «¡CLACK!» con WebAudio (`sound.ts`).
