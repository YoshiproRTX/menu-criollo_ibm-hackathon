# Goal

Un videojuego 3D isométrico, corto, divertido y adictivo, donde el jugador
entrena a robots torpes (Buddy, el robot doméstico, y Quark, el perrito)
ajustando su "cerebro cuántico" hecho con Qiskit.
Cada minijuego toma un concepto de Estadística o Machine Learning clásico
y lo mapea a su equivalente cuántico (QML), como pide la consigna del reto.
Diseño detallado de minijuegos: [minijuegos](minijuegos.md).

# Consigna del reto

Herramienta, juego o experiencia interactiva que tome un concepto de
Estadística o ML y mapee su equivalente cuántico (QML).
Pares sugeridos: Distribuciones ➔ Superposición y amplitudes ·
SVM ➔ QSVM y kernels cuánticos · Monte Carlo ➔ Quantum Amplitude Estimation ·
Redes neuronales ➔ QNN y VQC · Descenso de gradiente ➔ Gradiente cuántico.
Factor clave de evaluación: intuitivo, visualmente dinámico,
adictivo y divertido, y que el usuario aprenda QML mientras juega.

# Cómo se ve el éxito

El jugador da una instrucción y ve al robot fallar de forma graciosa
con el "Chip Rectilíneo" (modelo lineal).
El jugador abre el cerebro, cambia al chip cuántico, encaja fichas
(compuertas y perillas) y vuelve a intentarlo.
La decisión del robot sale de un circuito real de Qiskit corriendo en vivo,
y el robot mejora de forma visible.
Los 5 pares de la consigna quedan cubiertos por los minijuegos.
El minijuego estrella (2.2, QAE) muestra una ventaja cuántica real
y demostrada: misma precisión con muchas menos consultas que Monte Carlo.
Hay un video demo grabado en local donde todo funciona de principio a fin.

## Minijuegos y su concepto

| Minijuego | Clásico ➔ Cuántico | Prioridad |
| --- | --- | --- |
| 1.1 Pelusa Rebelde (tutorial) | SVM lineal ➔ codificación por rotación RY | A |
| 1.2 Fiebre en el Fregadero | SVM ➔ QSVM y kernel cuántico (XOR) | A |
| 2.2 Doble Hueso ⭐ estrella | Monte Carlo ➔ Quantum Amplitude Estimation | A |
| 2.1 Siéntate, Gira o Despega | Descenso de gradiente ➔ regla de parameter-shift | B |
| 1.3 Chef Catástrofe | Kernel clásico ➔ feature map cuántico (anillo) | B |
| 1.4 Lavandería en Remolino | Red profunda ➔ QNN con data re-uploading | C |
| 2.3 Pista Láser-Musical | Distribuciones ➔ superposición, amplitudes, interferencia | C |
| 2.4 Gran Copa Canina | Red neuronal ➔ VQC con ruido NISQ | C |

Orden de construcción: A completo (obligatorio para el video),
luego B si A está listo antes de la hora y media, luego C.
Lo de C puede quedar con la configuración básica corriendo de verdad,
pero sin escena ni animación propia.

Cada minijuego tiene **una sola dificultad fija** (⭐, ⭐⭐ o ⭐⭐⭐),
solo informativa, elegida para enseñar mejor su concepto.
No hay selector de dificultad. La "Tormenta NISQ" no es un modo de juego:
aparece solo en los minijuegos cuya dificultad fija la incluye.

## Rediseño del 2.2 «Doble Hueso» (estrella)

Quark debe estimar en qué túnel es más probable el hueso.
Con el chip simple (Monte Carlo) olfatea muchas veces: cada olfateo gasta
batería y la precisión sube lento (error ~ 1/√N).
Con el chip cuántico (QAE) llega a la misma precisión con muchos menos
olfateos (error ~ 1/N). Gráfica en vivo con ambas curvas.
QAE simple implementado a mano (1-2 qubits, potencias de Grover y máxima
verosimilitud), sin depender de `qiskit-algorithms`.
Chispa aclara que en hardware ruidoso actual el ruido se come esa ventaja.
Se eliminan los "Quarks fantasma" por ambos puentes (metáfora engañosa).

## Ganchos de adicción

Celebración inmediata estilo gambling: ¡CLACK! al encajar fichas,
el mapa que se dobla en vivo, caritas de 😱 a 😄, destellos al ganar.
Álbum de cromos: un cromo de concepto por minijuego, con botón
[🔬 Rayos-X Qiskit] que muestra el circuito real.
Los cromos tienen rareza (común, rara, holográfica, legendaria) que sale
de una medición real del circuito ganador (regla de Born).
Se revela sola con animación, sin palanca.
Álbum de desastres: cada error cómico distinto se colecciona,
sin rareza, para que el jugador quiera equivocarse y experimentar.
Estrellas de pericia por minijuego (resolver, acierto alto, circuito corto):
secundario.

## Honestidad científica

Nunca se afirma ventaja cuántica en los minijuegos de clasificación.
Ahí la lección es "una recta no basta, hay que curvar el espacio",
y lo cuántico es una forma de curvarlo (feature maps, kernels).
Chispa lo dice: "Una red neuronal clásica también podría;
aquí lo hacemos con qubits para ver cómo piensan".
La única ventaja real que se presenta es la de QAE (2.2).
Corregir en minijuegos.md: "H explora varias posibilidades a la vez"
(mito del paralelismo; usar "moneda cuántica"), "Quarks fantasma" (2.2)
y la Esfera de Bloch "envolviendo el mapa" (1.3; Bloch es de un solo qubit).
Cápsulas "¡Ajá!" y citas a papers se verifican con la skill de Qiskit
y documentación oficial antes de escribirlas.

## Qué es real y qué se puede simular

Siempre real: la decisión del robot con el chip cuántico, el acierto,
el mapa de decisión, el entrenamiento, el QAE y la rareza de los cromos.
Todo sale de Qiskit corriendo en el backend.
Se puede simular: efectos visuales de ruido NISQ, barra de estática,
animaciones de desastres, transiciones y cualquier cosa muy costosa
que solo sea decorativa.

# No goals

Reto del Día, rachas diarias, Tuercas Doradas, tienda y sombreros.
Palanca o tragamonedas para revelar cromos.
Rareza en los desastres.
Selector de dificultad o varias dificultades por minijuego.
Ejecutar en hardware cuántico real: simulación local basta.
Que QML controle cada movimiento: el circuito decide la acción,
la animación es normal.
Cuentas, guardado en la nube, multijugador, rankings online.
Dinero real o compras de cualquier tipo.
Arte final pulido: low-poly simple y expresivo basta.
Despliegue obligatorio: es un extra, no un requisito.

# Arquitectura

Backend: Python con uv, FastAPI y Qiskit 2.x corriendo en vivo
(`StatevectorSampler` / `Statevector`, sin hardware real).
Recibe el circuito del jugador y los datos del minijuego; devuelve
predicciones, acierto, mapa de decisión y diagrama del circuito.
Frontend: Vite, TypeScript y React Three Fiber (`@react-three/drei`),
cámara ortográfica isométrica. La consola del cerebro es una capa React
sobre el canvas. Assets low-poly CC0 (por ejemplo Kenney).
Motor compartido: los minijuegos de clasificación (1.1, 1.2, 1.3, 1.4,
2.3, 2.4) reutilizan el mismo radar 2D, fichas y endpoint, y cada uno
es un archivo de configuración (dataset, fichas permitidas, textos,
desastres, cromo). Solo 2.1 y 2.2 tienen interfaz propia.
Rendimiento medido en local (qiskit 2.5.2, 2 qubits): mapa de 2500
puntos ~2.2 s con 256 shots (usar `Statevector` para bajarlo),
entrenamiento de 100 iteraciones ~0.5 s, import ~1.7 s en caliente.
Despliegue opcional: backend en Render (gratis, se duerme tras inactividad)
y frontend en Cloudflare Pages. Qiskit no corre en Cloudflare Workers.

# Restricciones

Hackathon IBM Quantum (Qiskit Fall Fest 2026, EdTech), ~3 horas.
Equipo de 4 agentes de IA trabajando en paralelo.
Qiskit es obligatorio y es el núcleo del juego.
Un solo estilo visual: «Taller Retro-Pop de Villa Qubit».
Cada reto entendible sin conocimientos previos; máximo 14 palabras
antes de tocar algo.
Todo funciona en local y es reproducible con un comando.
Entregable principal: video demo grabado en local.

# Reparto del equipo (propuesta, por confirmar)

Primeros 15 minutos, entre todos: fijar el contrato de la API
(circuito del jugador ➔ predicciones, acierto, mapa, diagrama)
y el formato de configuración de minijuego. El frontend arranca con mocks.

1. QML (`backend/`): FastAPI con Qiskit, clasificador y kernel del motor
   compartido, QAE (2.2), parameter-shift (2.1), medición de rareza, pruebas.
2. Cerebro (`frontend/src/brain/`): consola Game Boy, cables, fichas
   arrastrables, perillas, radar 2D, interruptor simple/cuántico.
3. Mundo (`frontend/src/world/`): escena isométrica, Buddy, Quark, Chispa
   y animaciones de desastres.
4. Contenido y meta (`content/`, `frontend/src/meta/`): configuraciones
   de los 8 minijuegos, cromos revisados, álbumes, estrellas, guion
   del video; integración desde la hora 2.
