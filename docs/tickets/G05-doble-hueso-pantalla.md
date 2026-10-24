---
id: G05
titulo: 2.2 Doble Hueso, pantalla
responsable: Giovanni
agente: 6.1 sol
prioridad: A
status: ready-for-agent
bloqueado_por: [D01]
bloqueo_suave: [G04]
paralelizable_con: [G02, G03, D02, D03, D04, D05]
timebox_min: 40
---

# G05 — 2.2 Doble Hueso: pantalla

**Qué construir:** la interfaz propia del minijuego estrella, como un
componente que Daniel monta en el parque. El jugador elige chip simple
(Monte Carlo) o cuántico (QAE), Q-Boby olfatea los dos túneles gastando
batería visible, una gráfica en vivo dibuja la trayectoria real de cada
corrida y al final elige túnel: acierta y gana, o desastre cómico.

Leer antes: README de tickets (interfaz entre carriles), spec §«Minijuego 2.2»
e historias 45–50, `docs/ui-concept.md` (paleta y tono), `minijuegos.md` (2.2).
Mientras G04 no esté, usar el cliente en modo mock de D01.

## Detalle

- Vive solo en `frontend/src/minigames/doble-hueso/`; exporta por defecto un
  componente con las props `PantallaNivel2Props` del README. Usa
  `postEstimates` del cliente de `frontend/src/api/` (de D01); si falta algo
  en el cliente, pedirlo a Daniel, no editarlo.
- Flujo de una ronda: mostrar `chispa.inicio` → el jugador pulsa el
  interruptor simple/cuántico → «¡Olfatea, Q-Boby!» lanza dos llamadas
  (`tunel` a y b, `presupuesto` = `bateria / 2`) → se animan ambas
  trayectorias punto a punto (≈ 150 ms por punto) mientras baja la batería
  (consultas gastadas / `bateria`) → se elige el túnel con mayor
  `estimacion` → si es el de mayor `p` en el JSON: `onWin()`; si no:
  `onDisaster("rana")` y Chispa ofrece probar el otro chip.
- La gráfica: SVG a mano (sin librerías), eje x = consultas, eje y = error,
  una curva por método y por túnel; al correr el segundo método la curva del
  primero se mantiene para comparar. Leyenda con texto, no solo color.
- Tras ver ambos métodos, Chispa dice la frase honesta de consultas y luego
  `chispa.ruido`. Mostrar bajo la gráfica: «Esta es una corrida real. En 1000
  corridas: QAE elige bien 95 %, Monte Carlo 77 % (experiments/qae)».
- `semilla` opcional desde la URL (`?semilla=7`) para grabar el video de forma
  reproducible; sin ella, cada ronda es una corrida nueva.
- La batería, los olfateos y la animación de Q-Boby son decorativos; los
  números de la gráfica vienen tal cual de la API, sin suavizar.

## Criterios de aceptación

- [ ] Con el backend real, una ronda de cada chip anima trayectorias que
      coinciden punto a punto con la respuesta de la API.
- [ ] Ganar llama `onWin`; elegir mal llama `onDisaster("rana")`.
- [ ] Prueba Vitest de la función pura que elige el túnel y decide victoria.
- [ ] Se ve bien a 1280×720 (resolución del video).

## Notas
