---
id: G06
titulo: 1.3 Chef Catástrofe, perilla de escala (backend)
responsable: Giovanni
agente: 6.1 sol
prioridad: B
status: ready-for-agent
bloqueado_por: [G03]
paralelizable_con: [G07, D07]
timebox_min: 20
---

# G06 — 1.3 Chef Catástrofe: perilla de escala (backend)

**Qué construir:** el 1.3 jugable en el motor compartido. Con la escala de
fábrica la isla de panqueques queda demasiado grande y ningún circuito gana;
girando la Perilla de Escala (`escala` en cada `giro_y`) dentro de 2.5–5.5 rad
se gana. Solo empezar si A está integrado antes de T+90.

Leer antes: `experiments/rediseno_1_3/resultados.md` y `verificar_escala.py`,
spec §«Minijuego 1.3», `minijuegos.md` (1.3).

## Detalle

- `content/minigames/chef.json`: `rango: [-1, 1]`, disco de radio 0.45 con los
  datos del script (misma semilla), lectura `00` → `listo` (servir) / otra,
  `codificacion.escala: 1.5`, `perilla_escala: { min: 0.5, max: 8, paso: 0.25 }`,
  `ranuras: 1`, fichas `giro_y`, `prisma`, `cable_gemelo`. Textos según
  `minijuegos.md` (panqueques crudos, islas fantasma).
- La validación de `escala` ya existe desde G02; aquí solo confirmar con pruebas.

## Criterios de aceptación

- [ ] Ningún circuito de una ranura con la escala de fábrica llega a 0.9 en `prueba`.
- [ ] `giro_y` en ambos cables con `escala: 3.5` llega a ≥ 0.9.
- [ ] `escala: 9` → 422; `escala` enviada a `fregadero` → 422.
- [ ] `decision-map` cubre `[-1, 1]²`.

## Notas
