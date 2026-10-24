# Quantum Buddy — Entrena a tu compañero cuántico

Propuesta de videojuego educativo para **IBM Quantum Hackathon 2026 — Qiskit
Fall Fest**, categoría **EdTech — IEEE Computer Society PUCP**. Equipo de cuatro
integrantes. El nombre es provisional; el repositorio conserva
`menu-criollo_ibm-hackathon` y su remoto original.

Un compañero robótico torpe interpreta situaciones y comete errores graciosos.
El jugador experimenta con su «cerebro cuántico» para entender y mejorar sus
predicciones. El objetivo es aprender haciendo, sin conocimientos previos.

## Experiencia propuesta

- **Robot doméstico (prioridad del MVP):** barrer, lavar platos o preparar comida.
  Puede agarrar la escoba al revés o elegir una tarea incorrecta. Las actividades
  concretas y los dos o tres retos candidatos deben validarse con el equipo.
- **Perrito robótico (ampliación):** obedecer órdenes, superar obstáculos y hacer
  trucos. Puede saltar cuando debe sentarse. No debe comprometer el primer nivel.

El ciclo es **dar una instrucción → observar → entrenar su cerebro → reintentar
→ progresar**. Un personaje guía aporta explicaciones breves y contextuales.

## Objetivos educativos

Introducir ejemplos etiquetados, clasificación, predicción y la diferencia entre
entrenar e inferir. Progresivamente se podrán explorar parámetros, pérdida,
precisión, optimización clásica, codificación cuántica, circuitos variacionales
y clasificación híbrida. El MVP no tiene que cubrir toda la teoría.

## Integración prevista con Qiskit

Se investigará un clasificador cuántico variacional pequeño en simulación local:
**datos → codificación → circuito variacional → medición → predicción → acción**.
Un optimizador clásico podría ajustar parámetros durante el entrenamiento.
La arquitectura del VQC sigue pendiente de aprobación.

Las acciones deben corresponder a predicciones reales o a reglas explícitas del
juego; las animaciones se gestionan por separado. No se presentará azar visual
como aprendizaje ni se afirmará ventaja cuántica sin evidencia.

## Estado y tecnologías

**Fase actual: inicialización y documentación.** No hay videojuego, VQC, demo
ejecutable ni métricas de entrenamiento. Las únicas herramientas Python copiadas
son scripts auxiliares de la skill de terceros, no una implementación del producto.

Confirmados como dirección técnica: Python y Qiskit para el componente cuántico,
Git para colaboración y separación de interfaz, juego y motor QML. No se han
instalado dependencias ni fijado versiones del producto.

Pendientes: motor, frontend, backend, comunicación, arquitectura de entrenamiento,
persistencia, assets, versiones, uso de Aer y despliegue. Requieren aprobación.
La meta futura es una demo local reproducible con un comando; ese comando aún
no existe. Cloudflare es una posibilidad del antecedente, no un destino aprobado.

## Colaborar

Leer [AGENTS.md](AGENTS.md) antes de cambiar archivos. Conservar el antecedente
[goal.md](goal.md), que describe una hackathon de tres horas y cuatro frentes de
trabajo. El alcance actualizado está en los documentos siguientes; cualquier
cambio de prioridad debe quedar registrado.

| Documento | Contenido |
| --- | --- |
| [Concepto del juego](docs/game-concept.md) | Referencia conceptual principal y alcance |
| [Concepto de QML](docs/qml-concept.md) | Fundamentos y propuestas por validar |
| [Decisiones de arquitectura](docs/architecture-decisions.md) | Registro de decisiones pendientes |
| [Herramientas](docs/tooling.md) | Cuatro skills, MCP, configuración y licencias |
| [Atribuciones](docs/third-party-notices.md) | Procedencia y términos de terceros |

Las cuatro skills se incluyen en `.agents/skills/`. Los MCP son herramientas
opcionales del agente y se configuran por computadora. No incluir secretos,
entornos virtuales ni ejecutables. No hacer commits o push sin autorización.
