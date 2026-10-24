---
id: G09
titulo: Configuraciones C (1.4, 2.3, 2.4)
responsable: Giovanni
agente: 6.1 sol
prioridad: C
status: done
bloqueado_por: [G03]
paralelizable_con: [D08]
timebox_min: 25
---

# G09 — Configuraciones C (1.4, 2.3, 2.4)

**Qué construir:** los tres minijuegos C corriendo de verdad en el motor
compartido, solo con su JSON y pruebas de su lección. Sin escena propia: el
frontend los muestra en la consola genérica. Solo si A y B están listos.

Leer antes: `experiments/verificacion.md` (tabla Q5 y detalle de cada uno),
`experiments/verificar_minijuegos.py`, `minijuegos.md` (1.4, 2.3, 2.4).

## Detalle

- Extender el script de exportación de G02 con el mismo orden de rng:
  `lavanderia` (espiral de 1 vuelta, rng `SEMILLA + 14`, prueba 30 por brazo,
  ejemplos 20; `rango: [-1, 1]`, lectura qubit 0 = `0`, escala π, 5 ranuras),
  `pista` (rng principal **después** de 1.1 y 1.2; lectura qubit 1 = `0`,
  escala π, 4 ranuras, `prisma`, `giro_z`, `cable_gemelo`) y `copa` (pasillo
  diagonal, rng `SEMILLA + 24`; escala 2π, lectura qubit 1 = `0`, 4 ranuras,
  catálogo completo, `limite_fichas: 5`).
- Textos cortos de Chispa, desastres y cromo según `minijuegos.md`. En `copa`,
  Chispa aclara que la estática es decorativa y el robot decide con el
  circuito real.

## Criterios de aceptación

- [x] 1.4: el ganador de 7 fichas de `verificacion.md` da ≥ 0.9 en `prueba`.
- [x] 2.3: H·H → RZ·RZ → CX → H da 1.0; sin `prisma`, ≤ 0.6.
- [x] 2.4: el ganador de 5 fichas da ≥ 0.9; 6 fichas → 422.

## Notas

- Lavandería, Pista y Copa exportadas con las semillas y consumo de rng acordados. Ganadores reales de 7, 6 y 5 fichas verificados; Pista sin Prisma no gana y Copa rechaza seis fichas. Lavandería conserva camisa como acción positiva, conforme a Q5, y calcetín como otra clase. Decisiones sin ruido; límite como regla y estática decorativa. Sin escenas propias. Pruebas: test_content_lessons.py. B/C autorizados expresamente por el usuario.
- Validación del carril: 84 pruebas backend y 12 pruebas UI, dos con HTTP real; TypeScript y build aprobados. Sin commits ni push.
