# PATH — cómo orquestar los agentes

Tickets e índice: [docs/tickets/README.md](docs/tickets/README.md). El estado
de cada ticket está en su frontmatter (`status`). Sin GitHub Issues.

| Persona | Agente | Tickets |
| --- | --- | --- |
| Giovanni | 6.1 sol | `G01`–`G09` (backend, `content/`, pantallas 2.2 y 2.1) |
| Daniel | 4 argon | `D01`–`D08` (frontend del motor, mundo y meta) |
| Giano | Opus 5.5 | `I01` (integración final y happy path) |

## Reglas comunes

- **Una sesión de agente por ticket.** Varias sesiones a la vez solo si sus
  tickets están en la misma ola de abajo (tocan carpetas distintas).
- Todos trabajan sobre `main` con carpetas separadas (README de tickets,
  «Carpetas y dueños»). Al terminar cada ticket, **el humano** revisa y hace
  commit (`G02: predicciones 1.1 y 1.2`); luego `git pull --rebase && git push`.
  Los agentes no hacen commit ni push por su cuenta (AGENTS.md).
- Avisar por el chat del equipo dos momentos clave: **G01 listo** (fixtures del
  contrato) y **D01 listo** (cliente de la API). Son los únicos traspasos
  entre carriles antes de la integración.
- Si un agente se atasca más de 10 minutos: el humano anota `blocked` y el
  motivo en el ticket, y pasa a otro de la misma ola.

### Prompt base (pegar en cada sesión y cambiar el ID)

```text
Eres el agente del ticket <ID> de Q-Anacleto y Q-Boby.
1. Lee AGENTS.md, docs/tickets/README.md y docs/tickets/<ID>.md completos, y
   los documentos que el ticket pide leer.
2. Cambia `status` a `in-progress` en el frontmatter del ticket.
3. Implementa solo lo del ticket, dentro de las carpetas de tu responsable.
   Sigue los «Acuerdos congelados» del README; no los cambies.
4. Escribe las pruebas de los criterios de aceptación y córrelas.
5. Ante una duda que cueste más de 5 minutos: elige lo estándar y más simple,
   anótalo en «Notas» y sigue. No me preguntes salvo bloqueo real.
6. Al terminar: marca las casillas cumplidas, pon `status: done` (o `blocked`
   con el motivo) y resume en 5 líneas qué hiciste y cómo probarlo.
No hagas commit ni push.
```

## Giovanni (6.1 sol)

| Ola | Cuándo | Sesión 1 | Sesión 2 |
| --- | --- | --- | --- |
| 1 | T+0 | `G01` (rápido: desbloquea a Daniel) | — |
| 2 | G01 en `done` | `G02` → luego `G03` en la misma sesión | `G04` |
| 3 | G04 en `done` **y** aviso «D01 listo» | (sigue G03 si falta) | `G05` |
| 4 | Solo si A integrado antes de T+90 | `G06` → `G09` | `G07` → `G08` |

Comprobación rápida al cerrar cada ola: `uv run pytest` desde `backend/`.
Después de G03, avisar a Daniel para que pruebe con `npm run dev` (backend
real) en vez de `dev:mock`.

## Daniel (4 argon)

| Ola | Cuándo | Sesión 1 | Sesión 2 | Sesión 3 |
| --- | --- | --- | --- | --- |
| 1 | T+0 | `D01` (rápido: desbloquea a Giovanni) | — | — |
| 2 | D01 en `done` | `D02` (crea los huecos del layout) | — | — |
| 3 | D02 en `done` | `D03` (`brain/`) | `D04` (`world/`, `meta/chispa/`) | `D05` (`meta/cromos/`) |
| 4 | D04 en `done` | `D06` | — | — |
| 5 | Solo si A integrado antes de T+90 | `D07` | `D08` (después de D06) | — |

Comprobación rápida: `npm --prefix frontend run test` y abrir
`npm run dev:mock`. Mientras el backend no responda, trabajar en modo mock.

## Calendario y checkpoints

| Momento | Qué debe pasar |
| --- | --- |
| T+20 | G01 y D01 en `done`; contrato y comando único funcionando |
| T+60 | Motor compartido real (G02, G03) y 2.2 backend (G04); store y consola (D02, D03) |
| **T+90** | **Checkpoint A:** 1.1, 1.2 y 2.2 jugables con backend real. Si no, B y C se cancelan y todos ayudan a cerrar A |
| T+120 | B (G06–G08, D07) si se abrió. C solo si sobra tiempo |
| T+130 | Congelamiento: nadie empieza tickets nuevos. Entra Giano con `I01` |
| T+150 | Grabación del video |

## Giano (Opus 5.5) — integración

1. `git pull` y `grep -H "^status:" docs/tickets/*.md` para ver qué quedó.
2. Abrir una sesión con el prompt base y `<ID>` = `I01`. Pedirle además que
   lea los «Notas» de todos los tickets en `done` o `blocked`.
3. Orden de arreglo: comando único → health → 1.2 completo → 1.1 → 2.2 →
   cromo y álbum → B y C. Lo que no funcione se oculta, no se deja roto.
4. Recorrer el happy path de `I01` dos veces seguidas y grabar.
