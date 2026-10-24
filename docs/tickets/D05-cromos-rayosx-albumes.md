---
id: D05
titulo: Cromo, Rayos-X y álbumes
responsable: Daniel
agente: 4 argon
prioridad: A
status: done
bloqueado_por: [D02]
paralelizable_con: [D03, D04, G03, G04, G05]
timebox_min: 30
---

# D05 — Cromo, Rayos-X y álbumes

**Qué construir:** la recompensa. Al ganar se revela solo, con destello, el
cromo del concepto con su rareza real y las probabilidades de cada rareza
(regla de Born). **🔬 Rayos-X Qiskit** muestra el diagrama y el código Qiskit
reales. El álbum guarda cromos (con rareza) y desastres (sin rareza) entre
sesiones. **Continuar** lleva al siguiente minijuego.

Leer antes: breadboard §3–§4 (P3–P5, U19–U25, N30), spec historias 28–35,
README de tickets (orden del recorrido).

## Detalle

- En `frontend/src/meta/cromos/`. Lee y llama al store de D02.
- Modal del cromo cuando `cromoRevelado` existe: animación CSS de volteo y
  destello cuyo brillo depende de la rareza (común, rara, holográfica con
  degradado, legendaria dorada); `cromo.titulo`, `cromo.concepto`, las tres
  `lineas`; barras con `probabilidades` y el texto «Salió de 1 medición real
  del circuito ganador».
- Rayos-X: llama `getXray` con el circuito del store y muestra `diagrama` en
  `<pre>` monoespaciado y `codigo` con botón copiar. En `doble-hueso` y
  `trucos` el Rayos-X usa el mismo recurso (Giovanni lo implementa) o, si da
  404/501, se oculta el botón.
- Álbum: grilla con todos los minijuegos del catálogo (cromo obtenido o
  silueta) y grilla de desastres vistos con su texto.
- **Continuar** → `nextMinigame()` según el orden del README; si el siguiente
  es del parque, cambia `escena`.

## Criterios de aceptación

- [x] Ganar 1.2 revela el cromo con rareza y probabilidades de la API.
- [x] Rayos-X muestra diagrama y código reales.
- [x] Recargar la página conserva cromos y desastres.
- [x] Continuar desde 1.1 abre 1.2; desde 1.2 (sin chef) abre el parque.

## Notas

- `CromoModal.tsx` incluye volteo animado, estilos por rareza (común, rara, holográfica, legendaria), barras de probabilidades de Born y visor Rayos-X con botón de copiado.
- `AlbumModal.tsx` muestra la colección persistida en `localStorage` (`qab.cromos` y `qab.desastres`).
