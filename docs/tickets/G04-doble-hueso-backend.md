---
id: G04
titulo: 2.2 Doble Hueso, backend QAE y Monte Carlo
responsable: Giovanni
agente: 6.1 sol
prioridad: A
status: ready-for-agent
bloqueado_por: [G01]
paralelizable_con: [G02, G03, D01, D02, D03, D04, D05]
timebox_min: 35
---

# G04 — 2.2 Doble Hueso: backend QAE y Monte Carlo

**Qué construir:** el minijuego estrella en el backend.
`POST /api/minigames/doble-hueso/estimates` corre **una corrida real** de
Monte Carlo o de QAE (MLAE hecho a mano) sobre el mismo oráculo A y devuelve
su trayectoria de error contra consultas. Es la única ventaja cuántica real
del juego: en consultas al oráculo, no en tiempo.

Leer antes: `experiments/qae/resultados.md` y `experiments/qae/qae_spike.py`
(portar desde ahí, no reinventar), spec §«Minijuego 2.2», breadboard §8
(endpoints del 2.2), skills `qiskit` y `quantum-learn`.

## Detalle

- `content/minigames/doble-hueso.json`, `tipo: "doble-hueso"`, nivel 2,
  escenario `parque`. Campos propios:
  `tuneles: [{ "id": "a", "p": 0.30, "emoji": "🕳️" }, { "id": "b", "p": 0.36, ... }]`,
  `bateria: 180`, `qae: { "potencias": [0, 1, 2, 4], "shots_por_potencia": 5 }`,
  `monte_carlo: { "paso": 10 }` (cada cuántas consultas emite un punto).
  Más `chispa` (inicio, primer_fallo, victoria y `ruido` con la frase de
  Tanaka et al. 2021 de `resultados.md`, sin decir «se come»), `desastres`
  (`rana` = túnel equivocado; `barro` = sin batería), `cromo` (QAE ➔ Monte
  Carlo, tres líneas, citas Brassard 2002 y Suzuki 2020).
- Oráculo A = `RY(2·arcsin √p)`; Grover Q = Z → A† → X·Z·X → A, compuertas
  explícitas. Muestreo con `StatevectorSampler(seed=semilla)`.
- Cuerpo: `{ metodo, tunel, presupuesto?, semilla? }`. `presupuesto` por defecto
  = consultas por túnel del esquema (90). Consultas = Σ shots·(2k+1).
  - `qae`: un punto de trayectoria por potencia, con la estimación MLAE
    acumulada hasta esa potencia (grilla de θ en (0, π/2), 20 000 puntos).
  - `monte_carlo`: k = 0, un punto cada `paso` consultas hasta el presupuesto.
  - `error` = |estimación − p real del JSON|.
- 404 si el túnel no existe; 422 si `metodo` no es válido o `presupuesto` > `bateria`.
- `rarity-draws` de este minijuego (ignora el circuito): circuito de 2 qubits
  con A(p_a) en q0 y A(p_b) en q1, 1 shot real, mismo mapeo de rareza.

## Criterios de aceptación

- [ ] P(1) de Qᵏ·A coincide con sin²((2k+1)θ) (k = 0…8, tolerancia 1e-9).
- [ ] Con 30 shots por potencia y 50 semillas, pendiente log-log del RMSE de
      MLAE ≤ −0.85 y de Monte Carlo entre −0.6 y −0.4 (prueba lenta permitida,
      marcarla `@pytest.mark.slow` si pasa de 20 s).
- [ ] Con la batería de 180 (90 por túnel) y 200 semillas, QAE elige bien el
      túnel en ≥ 0.92 y Monte Carlo en ≤ 0.85.
- [ ] Una llamada tarda < 100 ms; forma igual a `content/contract/estimates.*.json`.
- [ ] Mismo `semilla` → misma trayectoria.

## Notas
