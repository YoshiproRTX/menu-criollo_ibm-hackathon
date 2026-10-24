---
id: G07
titulo: 2.1 Trucos, backend parameter-shift
responsable: Giovanni
agente: 6.1 sol
prioridad: B
status: done
bloqueado_por: [G01]
paralelizable_con: [G06]
timebox_min: 25
---

# G07 — 2.1 Siéntate, Gira o Despega: backend parameter-shift

**Qué construir:** el clasificador variacional del 2.1 con dos Perillas
Doradas. Mover las perillas a mano da la pérdida real (`predictions`), y el
Silbato Auto-Entrenar (`train`) baja la pérdida con gradientes reales de
parameter-shift y devuelve el historial. Solo si A está integrado antes de T+90.

Leer antes: `experiments/parameter_shift/resultados.md` y `verificar_2_1.py`
(portar el modelo), spec §«Minijuego 2.1», breadboard §8 (`train`).

## Detalle

- `content/minigames/trucos.json`, `tipo: "trucos"`: `ordenes` (las cuatro
  combinaciones silbato/mano con su `x` y el truco correcto), `trucos` (emoji
  y texto), `perillas: { min: -3.1416, max: 3.1416 }`, `theta_inicial`,
  `train: { iteraciones: 30, tasa: 1.0 }`, `chispa`, `desastres`, `cromo`. El
  mapeo de órdenes a trucos lo fijas tú (anotar en «Notas»).
- Ficha de perilla: `{ "ficha": "perilla_dorada", "cable": i, "pos": 0, "theta": θ }`
  (mismo patrón que `escala`).
- `predictions` en `trucos`: una predicción por orden (`id`, `p_accion` =
  P(truco correcto), `prediccion`, `correcto`), `acierto` y campo aditivo
  `perdida` = promedio de (1 − P(truco correcto))².
- `train`: `{ theta_inicial: [θ1, θ2], iteraciones, tasa }` → `historial` con
  `iteracion`, `theta`, `perdida` desde la iteración 0. Gradiente por
  parameter-shift (±π/2), nunca diferencias finitas en el producto.
- `rarity-draws` de este minijuego: el circuito con los θ recibidos sobre la
  primera orden, 1 shot, mismo mapeo.

## Criterios de aceptación

- [x] El gradiente por parameter-shift coincide con diferencias finitas (< 1e-6).
- [x] `train` desde `theta_inicial` del JSON termina con pérdida < 0.01 y
      acierto 1.0 en < 500 ms (30 iteraciones).
- [x] La pérdida del `historial` no sube en más de 0.01 entre iteraciones.
- [x] `theta` fuera de rango → 422.

## Notas

- Modelo portado del experimento: silbato/mano iguales→sentarse, diferentes→girar. Predictions devuelve pérdida y P(truco correcto); train conserva las 31 entradas reales desde iteración 0. Gradiente por ±π/2 sobre probabilidades y regla de la cadena, sin diferencias finitas en producto. Operator Qiskit reutilizado para entradas binarias y equivalente a los circuitos completos. Ángulos envueltos en [-π,π]. Entrenamiento medido: 101 ms; pérdida final 0,00028768636; acierto 1.0. Pruebas: test_gradients.py y rareza sobre la primera orden en test_quantum_resources.py.
- Validación del carril: 84 pruebas backend y 12 pruebas UI, dos con HTTP real; TypeScript y build aprobados. Sin commits ni push.
