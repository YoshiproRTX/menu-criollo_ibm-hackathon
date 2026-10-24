# Instrucciones para agentes

## Contexto

Quantum Buddy es el nombre provisional del videojuego para Qiskit Fall Fest 2026,
categoría EdTech (IEEE Computer Society PUCP). Equipo de cuatro integrantes;
público principiante en computación cuántica. Consultar README.md y
docs/game-concept.md para alcance y prioridades; conservar goal.md como antecedente.

## Propósito educativo

- Enseñar ML clásico y QML mediante interacción, ejemplos progresivos y retroalimentación comprensible.
- Relacionar cada mecánica con un concepto real y revisar su corrección científica.
- Distinguir entrenamiento de inferencia. Un VQC no equivale automáticamente a una red neuronal clásica.
- Vincular acciones a predicciones reales; identificar por separado las reglas del juego y las animaciones.

## Reglas técnicas

- Separar lógica del videojuego, interfaz y motor QML; mantener módulos pequeños y verificables.
- Priorizar un MVP funcional y reproducible del robot doméstico; el perrito es una ampliación.
- No afirmar ventajas cuánticas sin evidencia ni falsificar resultados o métricas de entrenamiento.
- Registrar versiones, semillas, datos y parámetros al implementar experimentos.
- Evitar entrenamiento por fotograma; validar predicciones con datos conocidos y comparar con una referencia clásica sencilla.
- Justificar la arquitectura, documentar decisiones en docs/architecture-decisions.md y explicarlas al equipo.
- Incorporar pruebas al desarrollar funcionalidades; usar convenciones consistentes para el código.
- La fase actual solo inicializa, configura y documenta: no implementar el juego ni el VQC.

## Uso de herramientas

- Usar las skills qiskit, quantum-learn, circuit-dev y circuit-debug cuando corresponda; leer su SKILL.md.
- Consultar los MCP qiskit y qiskit-docs cuando estén disponibles; no asumir su configuración en otras computadoras.
- Ver docs/tooling.md para licencias, recursos externos y límites de compatibilidad de QubitHub.
- Verificar las recomendaciones contra documentación oficial y versiones reales antes de ejecutarlas.

## Colaboración

- No ejecutar commits ni push sin autorización.
- No eliminar contenido existente sin revisión ni modificar configuraciones globales sin permiso.
- No incorporar credenciales ni archivos sensibles; revisar licencias de material externo.
- Solicitar aprobación antes de elegir motor de videojuegos, frontend, backend o dependencias principales.
- No instalar dependencias ni crear entornos virtuales durante la inicialización.
- Mantener la documentación explicativa en español y registrar las decisiones importantes.
