# Goal

Un videojuego corto y divertido donde el jugador entrena a un robot torpe
(QAnacleto / Qboby) ajustando su "cerebro cuántico" hecho con Qiskit,
y aprende conceptos básicos de Quantum Machine Learning mientras juega.

# Cómo se ve el éxito

El jugador da una instrucción y ve al robot fallar de forma graciosa (loop de errores tontos y graciosos).
El jugador abre el cerebro cuántico, ajusta un circuito (compuertas, parámetros) relacionado a Quantum Machine Learning (por definir mejor, ya que no sabemos casi nada de cuántica)
y vuelve a intentarlo.
Los ajustes cambian de verdad la salida de un circuito de Qiskit,
y esa salida decide lo que hace el robot (no es una animación falsa).
El robot mejora de forma visible a medida que el jugador entrena.
Hay al menos un nivel completo jugable de principio a fin:
Nivel 1, robot doméstico (barrer, lavar platos, cocinar, y etc. aún se pueden proponer mejores ideas), con 2-3 minijuegos / retos / circuitos cuánticos.
Un personaje guía explica cada concepto en una o dos frases.
La demo corre en vivo en la presentación, sin fallar.

# No goals

Nivel 2 (perrito robótico): solo si sobra tiempo, nunca a costa del Nivel 1.
Ejecutar en hardware cuántico real: el simulador (Aer) es suficiente. Es decir,
todo lo que qiskit pueda proveer en máquinas normales; si se puede deployear en
Cloudflare, mejor aún.
Que QML controle cada movimiento del robot: la animación es normal,
el circuito solo decide la acción o la clasificación de la situación.
Cuentas de usuario, guardado en la nube, multijugador.
Arte final pulido o sonido: personajes simples y expresivos bastan.
Entrenamientos pesados: todo debe responder en segundos.
Cubrir toda la teoría de QML: un concepto por reto.

# Restricciones

Hackathon IBM Quantum de 3 horas.
Equipo de 4 agentes de IA trabajando en paralelo.
Qiskit es obligatorio y es el núcleo del juego.
Un solo estilo visual, amigable y humorístico.
Cada reto debe ser entendible por alguien sin conocimientos previos.
Todo debe funcionar en local y ser reproducible con un comando.

# Reparto del equipo

1. Infraestructura Qiskit: inicializar el repo y las skills de Qiskit.
2. Investigación: riesgos técnicos y diseño de los minijuegos/retos cuánticos
   de cada tarea del robot (barrer, lavar, cocinar).
3. Juego e interfaz: bucle de juego (instruir, observar, entrenar, reintentar).
4. Integración y demo: conectar circuitos con el comportamiento del robot,
   guion de la presentación y pruebas finales.
