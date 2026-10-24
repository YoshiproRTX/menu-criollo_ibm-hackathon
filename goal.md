# Goal

Un videojuego 3D isométrico, corto, divertido y adictivo, donde el jugador
entrena a robots torpes (Q-Anacleto, el robot doméstico humanoide,
y Q-Boby, el perrito robótico) ajustando su "cerebro cuántico" hecho con Qiskit.
Cada minijuego toma un concepto de Estadística o Machine Learning clásico
y lo mapea a su equivalente cuántico (QML), como pide la consigna del reto.
Diseño detallado de minijuegos: [minijuegos](minijuegos.md).
Pantallas, código y contrato de la API del motor compartido:
[breadboard-fregadero](breadboard-fregadero.md).
Investigaciones (todas cerradas): [siguiente-sesion](siguiente-sesion.md).
Spec del producto (historias de usuario y decisiones): [docs/spec](docs/spec.md).

# Escenarios

Dos escenarios:

1. **La casa (Nivel 1, Q-Anacleto).** Recorrido natural: se empieza en la
   sala y se pasa a la cocina. Sala: 1.1 Pelusa Rebelde. Cocina: 1.2
   Fregadero y 1.3 Chef Catástrofe. Lavandería: 1.4 Lavandería en Remolino.
   Baño y habitación existen como habitaciones simples, sin minijuego por ahora.
2. **El parque (Nivel 2, Q-Boby).** Un parque genérico para perros.
   Minijuegos 2.1 a 2.4.

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
| 1.2 Fiebre en el Fregadero | SVM ➔ modelo cuántico como método de kernel (XOR) | A |
| 2.2 Doble Hueso ⭐ estrella | Monte Carlo ➔ Quantum Amplitude Estimation | A |
| 2.1 Siéntate, Gira o Despega | Descenso de gradiente ➔ regla de parameter-shift | B |
| 1.3 Chef Catástrofe | Ancho del kernel clásico ➔ escala de la codificación cuántica (isla) | B |
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

Q-Boby debe estimar en qué túnel es más probable el hueso.
Con el chip simple (Monte Carlo) olfatea muchas veces: cada olfateo gasta
batería y la precisión sube lento (error ~ 1/√N).
Con el chip cuántico (QAE) llega a la misma precisión con muchos menos
olfateos (error ~ 1/N). Gráfica en vivo con ambas curvas.
QAE simple implementado a mano (1-2 qubits, potencias de Grover y máxima
verosimilitud), sin depender de `qiskit-algorithms`.
Chispa aclara que en los chips ruidosos de hoy el error se satura: el ruido
le pone un piso a la ventaja (Tanaka et al. 2021; "se la come" exageraba).
Verificado con Qiskit en `experiments/qae/`, sobre el mismo oráculo:
- Pendiente del error: −0.50 para Monte Carlo y −1.05 para QAE.
- Batería de 180 olfateos (90 por túnel, potencias k = 0, 1, 2, 4 con
  5 mediciones cada una).
- Con túneles de p = 0.30 y 0.36, QAE elige bien el 95 % de las veces y
  Monte Carlo cerca del 77 %. Monte Carlo necesita ~4.4 veces más consultas.
- Una estimación tarda ~15 ms.
Citas verificadas en arXiv: Brassard et al. (2002) y Suzuki et al. (2020).
Se eliminan los "perritos fantasma" por ambos puentes (metáfora engañosa).
Endpoint: una llamada por método devuelve la trayectoria de una corrida real
(estimación y error contra consultas); el frontend solo la anima.
La frase de Chispa sobre el ruido se apoya en una fuente verificada, sin
`qiskit-aer`.

## Rediseño del 1.3 «Chef Catástrofe»

La lección es la escala de la codificación: una Perilla de Escala en cada
Giro-Sensor agranda o achica la isla, porque la escala es el ancho del kernel
(como el gamma de un kernel RBF). Verificado con Qiskit en
`experiments/rediseno_1_3/`: con una ranura por cable y la escala de fábrica
ningún circuito pasa del 67 %; con la perilla entre 2.5 y 5.5 rad se llega al
96–100 %; la regla recta se queda en 79 %. Con dos ranuras se ganaría
apilando giros, por eso el 1.3 usa una sola.

## Ruido en el 2.4 «Gran Copa Canina»

El límite de fichas es una regla del juego y la estática es solo decorativa.
El robot decide siempre con el circuito real sin ruido; pasarse del límite
dispara la Tormenta NISQ y el desastre, sin ejecutar el circuito.
`limite_fichas`: 5, el circuito mínimo que gana (verificado).

## Verificación de los minijuegos

En `experiments/verificacion.md`: búsqueda exhaustiva con Qiskit en cada
minijuego del motor compartido. En todos, la ficha que enseña el concepto es
la que cruza el 90 %. Esa misma tabla fija `lectura`, `codificacion`,
`ranuras` y los datos de cada JSON.
El 1.4 se rediseñó: espiral de 1 vuelta con 5 ranuras. Cargar cada sensor
una vez da 85 %; apilar giros, 87 %; volver a cargar tras el Cable Gemelo,
95 %.
El 2.1 usa como pérdida el promedio de (1 − P(truco correcto))², con
gradiente por parameter-shift verificado (`experiments/parameter_shift/`).

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
Base verificada: Schuld (2021), *Supervised quantum machine learning models
are kernel methods*, arXiv:2101.11020 (en `papers/`). Un modelo cuántico es
un modelo lineal sobre los estados que codifican los datos: la codificación
fija el kernel y la medición traza la frontera. Por eso en el 1.2 los
Giro-Sensores codifican y el Cable Gemelo cambia lo que se mide.
Chispa lo dice: "Una red neuronal clásica también podría;
aquí lo hacemos con qubits para ver cómo piensan".
La única ventaja real que se presenta es la de QAE (2.2).
Corregido en minijuegos.md: "H explora varias posibilidades a la vez"
(mito del paralelismo; usar "moneda cuántica"), "perritos fantasma" (2.2),
la Esfera de Bloch "envolviendo el mapa" (1.3; Bloch es de un solo qubit) y
las "acciones aleatorias" por estática (2.4; falsearían la decisión).
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
Recibe el circuito del jugador; lee los datos del minijuego de `content/`.
Endpoints REST separados por recurso (predicciones, mapa de decisión,
rareza, Rayos-X, estimaciones del 2.2 y entrenamiento del 2.1): contrato en
el breadboard. Las fichas de giro aceptan un campo opcional `escala` (perilla
del 1.3); las Perillas Doradas del Nivel 2 siguen el mismo patrón.
Modelo del motor compartido: lectura fija (el jugador diseña el circuito
y se lee la probabilidad de un resultado). Verificado: en el XOR da 50 %
sin CX y 100 % con CX. Mapa 32×32 con `Statevector` en ~250 ms.
Pruebas: pytest (backend, con uv) y Vitest (frontend), aprobadas.
Chip simple (la regla) calculado en el frontend. Estado con zustand,
álbumes en `localStorage`, Rayos-X en texto, comando único con `concurrently`.
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
Equipo de 3 agentes de IA trabajando en paralelo.
Qiskit es obligatorio y es el núcleo del juego.
Un solo estilo visual: «Taller Retro-Pop de Villa Qubit».
Cada reto entendible sin conocimientos previos; máximo 14 palabras
antes de tocar algo.
Todo funciona en local y es reproducible con un comando.
Entregable principal: video demo grabado en local.

# Reparto del equipo (confirmado)

Primeros 15 minutos, entre todos: fijar el contrato de la API
(circuito del jugador ➔ predicciones, acierto, mapa, diagrama)
y el formato de configuración de minijuego. El frontend arranca con mocks.

Tres agentes (el detalle por pieza está en la sección 10 del breadboard):

1. QML y contenido (`backend/`, `content/`): FastAPI con Qiskit, motor
   compartido, QAE (2.2), parameter-shift (2.1), rareza, pruebas, y los JSON
   de los minijuegos con sus datos verificados. Recibe los textos del carril 3.
2. Cerebro e integración (`frontend/src/brain/`, `frontend/src/api/`,
   `frontend/src/state/`): consola Game Boy, fichas, perillas, radar 2D,
   interruptor, cliente de la API, store y bucle de juego.
3. Mundo y meta (`frontend/src/world/`, `frontend/src/meta/`): casa y
   parque isométricos, Q-Anacleto, Q-Boby, Chispa, desastres, cromos,
   álbumes, textos y guion del video.

**Actualización (2026-10-24):** el trabajo se reparte finalmente entre dos
personas con sus agentes y un integrador. Giovanni: carril 1 más las
pantallas propias del 2.2 y el 2.1. Daniel: carriles 2 y 3. Giano: integración
final. Tickets, acuerdos congelados (ids, puertos, npm como gestor del
frontend, campos aditivos `tipo` y `rango`) y orquestación en
[docs/tickets](docs/tickets/README.md) y [PATH.md](PATH.md).
