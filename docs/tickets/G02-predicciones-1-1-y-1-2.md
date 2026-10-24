---
id: G02
titulo: Predicciones reales en 1.1 y 1.2
responsable: Giovanni
agente: 6.1 sol
prioridad: A
status: ready-for-agent
bloqueado_por: [G01]
paralelizable_con: [G04, D01, D02, D03, D04, D05]
timebox_min: 35
---

# G02 — Predicciones reales en 1.1 y 1.2

**Qué construir:** `POST /api/minigames/{id}/predictions` corriendo Qiskit de
verdad sobre los JSON reales de `pelusa` (1.1) y `fregadero` (1.2). El
jugador manda su circuito y el conjunto (`ejemplos` | `prueba`); el backend
decide cada objeto y devuelve el acierto. La lección del 1.2 queda fijada como
prueba: sin Cable Gemelo ~50 %, con él 100 %.

Leer antes: README de tickets (semántica del motor), spec §«Contrato de la API»
y §«Catálogo de fichas», `experiments/verificacion.md`,
`experiments/verificar_minijuegos.py`, `minijuegos.md` (1.1 y 1.2: objetos,
desastres, textos de Chispa y cromo), skills `qiskit` y `circuit-dev`.

## Detalle

- **Datos verificados:** un script en `backend/scripts/` reproduce la
  generación de `verificar_minijuegos.py` (semilla 21, **mismo orden de
  consumo del rng**: primero 1.1 —ejemplos 8 por centro, prueba 10—, luego
  1.2 —3 y 5—) y escribe `ejemplos` y `prueba` en los JSON. Etiqueta 1 =
  acción positiva (`lectura.accion`). Los ids de objeto con sufijo (`plato-1`).
- **Configuración** (tabla Q5 de `verificacion.md`):
  - `pelusa`: lectura qubit 1 = `0` → `barrer` (otra: `ignorar` o la que diga
    `minijuegos.md`), escala π, 2 ranuras, fichas `giro_y`. Polvo positivo,
    gato negativo.
  - `fregadero`: lectura qubit 1 = `0` → `lavar` / `basura`, escala π, 4
    ranuras, `giro_y`, `prisma`, `cable_gemelo`.
  - Ambos con `tipo`, `nivel`, `escenario`, `habitacion`, `titulo`,
    `dificultad`, `objetos` con emoji, `victoria.acierto_minimo: 0.9`,
    `objeto_estrella`, `desastres`, `chispa` (inicio, primer_fallo,
    primera_ficha, victoria; máximo 14 palabras en `inicio`) y `cromo`
    (concepto, título, tres líneas). En 1.1 Chispa dice que si una recta
    basta no hace falta lo cuántico e invita a probar los Giro-Sensores; en
    1.2 dice «Una red neuronal clásica también podría…».
- **Validación → 422:** ficha no permitida, cable fuera de {0, 1}, `pos` fuera
  de `[0, ranuras)`, ranura ocupada (incluye cualquier ficha en la `pos` de un
  `cable_gemelo`), `escala` en un minijuego sin `perilla_escala` o fuera de
  rango, más fichas que `limite_fichas` si existe.
- Predicción con `Statevector` (probabilidades exactas), `meta` con ms reales.

## Criterios de aceptación

- [ ] Pruebas pytest con `TestClient` sobre los JSON reales:
  - [ ] 1.2, `prueba`: `giro_y` en ambos cables → acierto ≤ 0.6; añadiendo
        `cable_gemelo` (RY·RY → CX) → acierto = 1.0.
  - [ ] 1.2: ningún circuito sin `cable_gemelo` de hasta 4 ranuras llega a 0.9
        (búsqueda exhaustiva, o al menos el mejor conocido de `verificacion.md`).
  - [ ] 1.1: un solo `giro_y` en el cable 1 → acierto ≥ 0.9; circuito vacío → 0.5.
  - [ ] Cada caso de 422 de la lista anterior.
  - [ ] La forma de la respuesta coincide con `content/contract/predictions.json`.
- [ ] Respuesta en < 100 ms para 20 objetos.

## Notas
