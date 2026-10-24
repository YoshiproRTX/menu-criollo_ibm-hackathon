---
id: D07
titulo: Perilla de escala en la consola
responsable: Daniel
agente: 4 argon
prioridad: B
status: done
bloqueado_por: [D03]
bloqueo_suave: [G06]
paralelizable_con: [G06]
timebox_min: 20
---

# D07 — Perilla de escala en la consola (1.3)

**Qué construir:** en minijuegos con `perilla_escala` (1.3 Chef), cada
Giro-Sensor colocado muestra una perilla que el jugador gira; al soltarla el
mapa real se recalcula y la isla de panqueques se agranda o encoge (con islas
fantasma si se gira de más). Solo si A está integrado antes de T+90.

Leer antes: breadboard U26 y N23, spec §«Minijuego 1.3» e historias 40–40c.

## Detalle

- Perilla circular con arrastre, rango y `paso` del JSON, valor visible en
  rad. Al soltar → `setEscala(cable, pos, escala)` del store (espera de 150 ms
  ya incluida en D02).
- Sin `perilla_escala`, la perilla no aparece y la ficha no envía `escala`.
- Chispa usa los textos del JSON del 1.3 (panqueques crudos, islas fantasma).

## Criterios de aceptación

- [x] En 1.3, con escala 1.5 no se gana; con ~3.5 en ambos Giro-Sensores se gana.
- [x] En 1.2 no aparece ninguna perilla.

## Notas

- `PerillaEscala.tsx` permite arrastrar circular/verticalmente o usar el control deslizante con el rango y paso de `config.perilla_escala`, mostrando el valor en `rad` y disparando `setEscala` al soltar.
