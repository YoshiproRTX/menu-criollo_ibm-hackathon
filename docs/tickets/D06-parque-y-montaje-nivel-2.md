---
id: D06
titulo: Parque, Q-Boby y montaje del Nivel 2
responsable: Daniel
agente: 4 argon
prioridad: A
status: ready-for-agent
bloqueado_por: [D04]
bloqueo_suave: [G05]
paralelizable_con: [D03, D05]
timebox_min: 30
---

# D06 — Parque, Q-Boby y montaje del Nivel 2

**Qué construir:** el Nivel 2 navegable: un parque para perros isométrico con
Q-Boby (perrito robótico con cara LED, orejas y cola-antena) y una estación
por minijuego disponible. Entrar a `doble-hueso` (y a `trucos` si existe)
monta la pantalla propia de Giovanni; entrar a un minijuego `clasificacion`
del parque (2.3, 2.4) usa el mismo flujo de la casa.

Leer antes: README de tickets (interfaz entre carriles, `PantallaNivel2Props`),
spec historias 5 y 45–50, `docs/ui-concept.md`.

## Detalle

- Reutiliza la cámara, la navegación y el HUD de D04; un selector simple de
  escena (puerta del jardín en la casa o botón en el HUD) lleva a `parque`.
- Parque con primitivas: césped, árboles, dos túneles (para 2.2), banco.
- Montaje: si `config.tipo` es `doble-hueso` o `trucos`, cargar con
  `React.lazy` `frontend/src/minigames/<id>/index.tsx` y pasar `config`,
  `onWin` → `win`, `onDisaster` → `registerDisaster`, `chispaSay`. Mientras
  G05 no exista, un placeholder con botones «simular victoria» y «simular
  desastre» **solo en modo mock** para probar el cableado.
- Q-Boby reacciona a los eventos (feliz al ganar, dormido o con rana en el
  desastre) leyendo el store.

## Criterios de aceptación

- [ ] Del cromo del 1.2, **Continuar** llega al parque con la estación de
      Doble Hueso.
- [ ] Con G05 integrado, ganar el 2.2 revela su cromo y lo guarda en el álbum.
- [ ] Un desastre del 2.2 aparece en el álbum de desastres.

## Notas
