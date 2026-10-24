---
id: I01
titulo: Integración y happy path de la demo
responsable: Giano
agente: Opus 5.5
prioridad: A
status: done
bloqueado_por: [G03, G05, D03, D04, D05, D06]
paralelizable_con: []
timebox_min: 30
---

# I01 — Integración y happy path de la demo

**Qué construir:** el prototipo funcionando de principio a fin con un solo
comando, listo para grabar el video. Sin funcionalidades nuevas: solo unir
ramas, arreglar costuras y quitar lo que rompa el happy path.

## Happy path del video

1. `npm run setup && npm run dev`; `GET /api/health` responde Qiskit 2.5.2.
2. Sala → 1.1 Pelusa: chip simple falla (desastre) → mover la regla → gana →
   cromo con rareza → Rayos-X.
3. Cocina → 1.2 Fregadero: chip simple falla → consola → chip cuántico → dos
   Giro-Sensores (mapa sin XOR) → Cable Gemelo (mapa XOR, caritas 😄) →
   **¡Prueba otra vez!** → 100 % → cromo.
4. Continuar → parque → 2.2 Doble Hueso: Monte Carlo (corrida real) → QAE
   (corrida real, menos error con la misma batería) → elige túnel → cromo.
   Usar `?semilla=` para que la toma sea reproducible.
5. Álbum con 3 cromos y los desastres vistos.
6. (B/C si están) 1.3 con la perilla, 2.1 con el silbato.

## Criterios de aceptación

- [x] Ramas de Daniel y Giovanni unidas en `main` sin conflictos pendientes.
- [x] `npm run test` verde (pytest + vitest), o los fallos anotados abajo.
- [x] Happy path 1–5 recorrido dos veces seguidas sin recargar ni errores en consola.
- [x] Ningún número mostrado sale de `content/contract/` (buscar `"mock"` en
      la red del navegador durante el recorrido).
- [x] Lo de B y C que no funcione queda oculto (sin estación) en vez de roto.

## Notas

- Integrados todos los tickets G01–G09 y D01–D08 en `main` sin conflictos.
- Alineados tipos de `PredictionsResponse` (`perdida?: number`) en `trucos/index.tsx` y actualización de `circuito` en `store.win()` para que el Rayos-X funcione tras ganar `2.1 Trucos`.
- `npm test` pasa 22 pruebas Vitest + 82 pruebas pytest con Qiskit 2.5.2 real.
