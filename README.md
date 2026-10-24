# Q-Anacleto y Q-Boby — Entrena a tu compañero cuántico

Propuesta de videojuego educativo para **IBM Quantum Hackathon 2026 — Qiskit
Fall Fest**, categoría **EdTech — IEEE Computer Society PUCP**. Equipo de cuatro
integrantes, unas tres horas de desarrollo. El nombre es provisional; el
repositorio conserva `menu-criollo_ibm-hackathon` y su remoto original.

Robots torpes (Q-Anacleto, el robot doméstico humanoide, y Q-Boby, el perrito
robótico) cometen errores
graciosos con su «Chip Rectilíneo». El jugador abre su «cerebro cuántico»,
encaja compuertas y perillas, y ve cómo el robot aprende. Cada minijuego mapea
un concepto de Estadística o ML clásico a su equivalente cuántico (QML).

## Documentos

| Documento | Contenido |
| --- | --- |
| [goal.md](goal.md) | **Fuente de verdad:** alcance, prioridades, decisiones y arquitectura |
| [minijuegos.md](minijuegos.md) | Diseño detallado de temática, personajes y los 8 minijuegos |
| [breadboard-fregadero.md](breadboard-fregadero.md) | Pantallas, código, contrato de la API y formato de configuración del motor compartido |
| [siguiente-sesion.md](siguiente-sesion.md) | Plan de la prueba del QAE y de los demás desconocidos |
| [AGENTS.md](AGENTS.md) | Instrucciones para los agentes de IA del equipo |

Si algo en otro documento contradice a `goal.md`, manda `goal.md`.

## Experiencia

El ciclo es **dar una instrucción → ver el desastre → abrir el cerebro y
encajar fichas → reintentar → ganar el cromo**.

- **Nivel 1, la casa, Q-Anacleto:** de la sala a la cocina; barrer, lavar
  platos, cocinar y separar ropa.
- **Nivel 2, el parque, Q-Boby:** obedecer órdenes, estimar en qué túnel está el hueso
  (minijuego estrella con Quantum Amplitude Estimation), ritmo y gran final.

El orden de construcción (prioridades A, B y C) está en `goal.md`.

## Integración con Qiskit

Las decisiones del robot salen de circuitos reales de Qiskit corriendo en
vivo en un backend local; las animaciones se gestionan por separado.
No se afirma ventaja cuántica en los minijuegos de clasificación: la única
ventaja real que se presenta es la de QAE frente a Monte Carlo.

## Tecnologías

- **Backend:** Python con uv, FastAPI y Qiskit 2.x (simulación local, sin
  hardware real).
- **Frontend:** Vite, TypeScript y React Three Fiber, vista isométrica.
- **Despliegue (opcional):** backend en Render y frontend en Cloudflare Pages.
  El entregable principal es un video demo grabado en local.

Estado: diseño cerrado, implementación por empezar. El comando único para
levantar todo en local se documentará aquí cuando exista.

## Colaborar

Leer [AGENTS.md](AGENTS.md) antes de cambiar archivos. Las skills de Qiskit
están en `.agents/skills/`. No incluir secretos, entornos virtuales ni
ejecutables. No hacer commits o push sin autorización.
