# Instrucciones para agentes

## Contexto

Quantum Buddy es el nombre provisional del videojuego para Qiskit Fall Fest 2026,
categoría EdTech (IEEE Computer Society PUCP). Equipo de cuatro integrantes,
unas tres horas de desarrollo; público principiante en computación cuántica.
**goal.md es la fuente de verdad** de alcance, prioridades y arquitectura;
minijuegos.md tiene el diseño detallado de cada minijuego.

## Propósito educativo

- Enseñar ML clásico y QML mediante interacción, ejemplos progresivos y retroalimentación comprensible.
- Relacionar cada mecánica con un concepto real y revisar su corrección científica.
- Distinguir entrenamiento de inferencia. Un VQC no equivale automáticamente a una red neuronal clásica.
- Vincular acciones a predicciones reales; identificar por separado las reglas del juego y las animaciones.
- No afirmar ventaja cuántica en los minijuegos de clasificación; la única ventaja real presentada es QAE (2.2).

## Reglas técnicas

- Stack decidido: backend Python con uv, FastAPI y Qiskit 2.x en vivo; frontend Vite, TypeScript y React Three Fiber.
- Separar lógica del videojuego, interfaz y motor QML; mantener módulos pequeños y verificables.
- Respetar el orden de prioridades A, B y C de goal.md.
- Usar el contrato de API y el formato de configuración de minijuego acordados por el equipo; no cambiarlos sin avisar.
- La decisión del robot, el acierto, el entrenamiento, el QAE y la rareza de cromos salen siempre de Qiskit real. Solo se simulan efectos decorativos.
- No falsificar resultados ni métricas de entrenamiento. Fijar semillas en experimentos.
- Evitar entrenamiento por fotograma; validar predicciones con datos conocidos y comparar con una referencia clásica sencilla.
- Incorporar pruebas al desarrollar funcionalidades; usar convenciones consistentes para el código.

## Uso de herramientas

- Usar las skills qiskit, quantum-learn, circuit-dev y circuit-debug cuando corresponda; leer su SKILL.md.
- Consultar los MCP qiskit y qiskit-docs cuando estén disponibles; no asumir su configuración en otras computadoras.
- Verificar las recomendaciones contra documentación oficial y versiones reales antes de ejecutarlas.
- Gestionar dependencias de Python con uv y del frontend con el gestor que fije el equipo.

## Colaboración

- No ejecutar commits ni push sin autorización.
- Trabajar dentro de la carpeta del propio carril para no pisar a otros agentes.
- No eliminar contenido existente sin revisión ni modificar configuraciones globales sin permiso.
- No incorporar credenciales ni archivos sensibles; revisar licencias de material externo (por ejemplo assets CC0).
- Pedir aprobación antes de añadir dependencias principales fuera del stack decidido.
- Mantener la documentación explicativa en español y registrar las decisiones importantes en goal.md.
